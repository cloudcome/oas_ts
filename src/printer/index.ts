import path from 'node:path';
import { pkgName } from '../const';
import type { OpenApi3 } from '../types/openapi';
import { never } from '../utils/func';
import { isString } from '../utils/type-is';
import { Arg } from './Arg';
import { Args } from './Args';
import { AXIOS_IMPORT_FILE, AXIOS_IMPORT_NAME, AXIOS_QUEST_CONFIG_TYPE_NAME, AXIOS_PROMISE_TYPE_NAME } from './const';
import {
    filterLine,
    isRefMedia,
    isRefOperation,
    isRefParameter,
    isRefPathItem,
    isRefRequest,
    isRefResponse,
    type OpenApi3_Media,
    type OpenApi3_Operation,
    type OpenApi3_Parameter,
    type OpenApi3_Request,
    type OpenApi3_Response,
    type OpenApi3_Schema,
} from './helpers';
import { JsDoc } from './JsDoc';
import { Named } from './Named';
import { Schemata } from './Schemata';
import type { PrinterOptions, PrinterConfigs, RequestStatusCodeMatch } from './types';
import { toRelative } from '../utils/path';

const allowMethods = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace'];

type RequestMediaMatch = (contentType: string, content: OpenApi3_Media) => boolean;
type ResponseMediaMatch = (contentType: string, content: OpenApi3_Media, response: OpenApi3.ResponseObject) => boolean;

type ResponseMatch = (statusCode: string, response: OpenApi3_Response) => boolean;

export class Printer {
    named = new Named();
    schemata = new Schemata(this.named);
    private configs: PrinterConfigs = {};

    constructor(
        private readonly document: OpenApi3.Document,
        private options?: PrinterOptions,
    ) {
        const { openapi } = document;

        if (!openapi) throw new Error(`未找到 openapi 版本号`);
        if (!openapi.startsWith('3.')) throw new Error(`当前仅支持 openapi 3.x，当前版本为 ${openapi}`);

        this.registerComponents();
        this.named.internalVarName(options?.axiosImportName || AXIOS_IMPORT_NAME);
    }

    refRequestBodies: Record<string, OpenApi3_Request> = {};
    refParameters: Record<string, OpenApi3_Parameter> = {};
    refResponses: Record<string, OpenApi3_Response> = {};
    registerComponents() {
        const { schemas = {}, requestBodies = {}, parameters = {}, responses = {} } = this.document.components || {};

        Object.entries(schemas).forEach(([name, schema]) => {
            const id = '$id' in schema ? schema.$id : '';
            this.named.nextRefName(name, id || `#/components/schemas/${name}`);
        });

        Object.entries(requestBodies).forEach(([name, requestBody]) => {
            const id = ('$id' in requestBody && requestBody.$id) || `#/components/requestBodies/${name}`;
            this.refRequestBodies[id] = requestBody;
        });

        Object.entries(parameters).forEach(([name, parameter]) => {
            const id = ('$id' in parameter && parameter.$id) || `#/components/parameters/${name}`;
            this.refParameters[id] = parameter;
        });

        Object.entries(responses).forEach(([name, response]) => {
            const id = ('$id' in response && response.$id) || `#/components/responses/${name}`;
            this.refResponses[id] = response;
        });
    }

    print(configs?: PrinterConfigs) {
        Object.assign(this.configs, configs);
        const { hideInfo, hideComponents, hideImports, hidePaths } = this.configs;

        return [
            //
            !hideInfo && this._printInfo(),
            !hideImports && this._printImports(),
            !hideComponents && this._printComponents(),
            !hidePaths && this._printPaths(),
        ]
            .filter(Boolean)
            .join('\n\n');
    }

    private _printImports() {
        const {
            axiosImportName = AXIOS_IMPORT_NAME,
            axiosNamedImport,
            axiosImportFile = AXIOS_IMPORT_FILE,
            axiosRequestConfigTypeName = AXIOS_QUEST_CONFIG_TYPE_NAME,
            axiosResponseTypeName = AXIOS_PROMISE_TYPE_NAME,
            baseURL,
        } = this.options || {};
        const firstServer = this.document.servers?.[0];
        const defaultBaseURL = firstServer?.url || '/';
        const BASE_URL = isString(baseURL) ? baseURL : baseURL?.(this.document) || defaultBaseURL;
        const { file } = this.configs;
        const importPath = toRelative(axiosImportFile, file);

        return [
            //
            '/* eslint-disable @typescript-eslint/ban-ts-comment */',
            '/* eslint-disable @typescript-eslint/no-explicit-any */',
            '',
            axiosNamedImport
                ? // 具名导入
                  `import {${axiosImportName}} from "${importPath}";`
                : // 默认导入
                  `import ${axiosImportName} from "${importPath}";`,
            `import type {${axiosRequestConfigTypeName}, ${axiosResponseTypeName}} from "${importPath}";`,
            `import type {OneOf, AllOf, AnyOf, AnyObject, AnyArray} from "${pkgName}/client";`,
            `import {resolveURL} from "${pkgName}/client";`,
            '',
            `const BASE_URL=${JSON.stringify(BASE_URL)};`,
        ].join('\n');
    }

    private _printInfo() {
        const { contact, description, license, summary, termsOfService, title, version } = this.document.info;
        const { externalDocs } = this.document;
        const { name, email, url } = contact || {};
        const jsDoc = new JsDoc();
        const { module } = this.configs;
        if (module) jsDoc.addComments({ module });
        const extDoc = JsDoc.printExternalDoc(externalDocs);
        jsDoc.addComments({
            title,
            version,
            contact: name || url || email ? [name, email ? `<${email}>` : '', url ? `(${url})` : ''].filter(Boolean).join(' ') : undefined,
            description,
            summary,
            see: extDoc,
        });
        return jsDoc.print();
    }

    private _printComponents() {
        return Object.entries(this.document.components?.schemas || {})
            .map(([name, schema]) => {
                const id = schema.$id || `#/components/schemas/${name}`;
                return this._printComponent(name, id, schema);
            })
            .join('\n\n');
    }

    private _printComponent(name: string, id: string, schema: OpenApi3_Schema) {
        const { comments, type } = this.schemata.print(schema);
        const jsDoc = new JsDoc();
        jsDoc.addComments(comments);
        const typeName = this.named.getRefType(id);

        return [jsDoc.print(), `export type ${typeName} = ${type};`].filter(Boolean).join('\n');
    }

    private _printPaths() {
        return Object.entries(this.document.paths || {})
            .map(([url, pathItem]) => {
                if (isRefPathItem(pathItem)) return;

                return this._printPathItem(url, pathItem).filter(filterLine).join('\n\n');
            })
            .join('\n\n');
    }

    private _printPathItem(url: string, pathItem: OpenApi3.PathItemObject) {
        return Object.entries(pathItem).map(([method, _operation]) => {
            const isOperation = allowMethods.includes(method);
            if (!isOperation) return;

            const operation = _operation as OpenApi3_Operation;
            if (isRefOperation(operation)) return;

            // TODO 注释掉上句之后，不知为何这里类型没有报错，operation 包含对象和引用两种类型
            return this._printOperation(method, url, operation);
        });
    }

    private _printOperation(method: string, url: string, operation: OpenApi3.OperationObject) {
        const argNamed = new Named();
        const header = new Arg(argNamed, 'headers', this.schemata);
        const cookie = new Arg(argNamed, 'cookies', this.schemata);
        const query = new Arg(argNamed, 'params', this.schemata);
        const path = new Arg(argNamed, 'path', this.schemata);
        const data = new Arg(argNamed, 'data', this.schemata, true);
        const config = new Arg(argNamed, 'config', this.schemata, true);
        const resp = new Arg(argNamed, 'response', this.schemata, true);
        const { parameters, requestBody, responses, operationId } = operation;
        const { responseStatusCode, responseContentType, requestContentType } = this.options || {};

        if (parameters) {
            parameters.forEach((parameter) => {
                this._parseParameter(parameter, {
                    header,
                    cookie,
                    path,
                    query,
                });
            });
        }

        if (requestBody) {
            this._parseRequestBody(data, requestBody, (contentType, content) => {
                if (isString(requestContentType)) return requestContentType === contentType;
                if (!requestContentType) return true;

                return requestContentType(contentType, {
                    content,
                    method,
                    operation,
                    url,
                });
            });
        }

        if (responses) {
            this._parseResponses(
                resp,
                responses,
                (statusCode, response) => {
                    if (isString(responseStatusCode)) return responseStatusCode === statusCode;
                    if (!responseStatusCode) return statusCode.startsWith('2');

                    return responseStatusCode(statusCode, {
                        method,
                        url,
                        operation,
                        response,
                        responses,
                    });
                },
                (contentType, content, response) => {
                    if (isString(responseContentType)) return responseContentType === contentType;
                    if (!responseContentType) return true;

                    return responseContentType(contentType, {
                        content,
                        method,
                        operation,
                        url,
                        response,
                        responses,
                    });
                },
            );
        }

        const funcName = this.named.nextOperationId(method, url, operationId);
        const requestArgs = new Args([header.parse(), query.parse(), path.parse(), data.parse(), config.parse()]);
        const responseArgs = new Args([resp.parse()]);
        const respType = responseArgs.toType(0);
        const jsDoc = new JsDoc(this.document.tags);
        const comments = JsDoc.fromOperation(operation);
        const { module } = this.configs;
        if (module) jsDoc.addComments({ module });
        jsDoc.addComments(comments);
        jsDoc.addComments(requestArgs.toComments());
        jsDoc.addComments(responseArgs.toComments());
        const { axiosRequestConfigTypeName = AXIOS_QUEST_CONFIG_TYPE_NAME } = this.options || {};

        return `${jsDoc.print()}
export async function ${funcName}(${requestArgs.toArgs(axiosRequestConfigTypeName)}): AxiosPromise<${respType}> {
    return axios({
        method: ${JSON.stringify(method)},
        ${requestArgs.toValues(url)}
    });
}`;
    }

    private _parseContents(
        arg: Arg,
        contents: { [contentType: string]: OpenApi3.MediaTypeObject | OpenApi3.ReferenceObject },
        comments: {
            description?: string;
            required?: boolean;
        },
        match: RequestMediaMatch,
    ) {
        const content = Object.entries(contents).find(([contentType, content]) => {
            return match(contentType, content);
        })?.[1];

        if (!content) return;

        this._parseContent(arg, content, comments);
    }

    private _parseContent(
        arg: Arg,
        content: OpenApi3_Media,
        comments: {
            description?: string;
            required?: boolean;
        },
    ) {
        if (isRefMedia(content)) {
            const { $ref } = content;
            const label = arg.kind === 'response' ? '响应' : '请求';

            throw new Error(`不支持引用${label}内容：${$ref}`);
        } else {
            arg.add({
                in: 'query',
                name: 'data',
                ...comments,
                schema: content.schema,
                required: true,
            });
        }
    }

    private _parseParameter(parameter: OpenApi3_Parameter, args: Record<OpenApi3.ParameterObject['in'], Arg>) {
        if (isRefParameter(parameter)) {
            const { $ref } = parameter;
            const refParameter = this.refParameters[$ref];

            if (!refParameter) throw new Error(`未发现引用参数（${$ref}）`);

            this._parseParameter(refParameter, args);
            return;
        }

        switch (parameter.in) {
            case 'query':
            case 'header':
            case 'path':
            case 'cookie':
                args[parameter.in].add(parameter);
                break;
            default:
                never(parameter.in);
        }
    }

    private _parseRequestBody(arg: Arg, requestBody: OpenApi3_Request, match: RequestMediaMatch) {
        if (!requestBody) return;

        if (isRefRequest(requestBody)) {
            const { $ref } = requestBody;
            const refRequestBody = this.refRequestBodies[$ref];

            if (!refRequestBody) throw new Error(`未发现引用请求（${$ref}）`);

            this._parseRequestBody(arg, refRequestBody, match);
            return;
        }

        this._parseContents(arg, requestBody.content, requestBody, match);
    }

    private _parseResponses(arg: Arg, responses: OpenApi3.ResponsesObject, responseMatch: ResponseMatch, contentMatch: ResponseMediaMatch) {
        const response = Object.entries(responses).find(([statusCode, response]) => {
            return responseMatch(statusCode, response);
        })?.[1];

        if (!response) return;

        this._parseResponse(arg, response, contentMatch);
    }

    private _parseResponse(arg: Arg, response: OpenApi3_Response, contentMatch: ResponseMediaMatch) {
        if (isRefResponse(response)) {
            const { $ref } = response;
            const refResponse = this.refResponses[$ref];

            if (!refResponse) throw new Error(`未发现引用响应（${$ref}）`);

            this._parseResponse(arg, refResponse, contentMatch);
            return;
        }

        const { content } = response;
        if (!content) return;

        this._parseContents(arg, content, response, (contentType, content) => contentMatch(contentType, content, response));
    }
}
