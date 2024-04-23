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
    type OpenApi3_Request,
    type OpenApi3_Response,
    type OpenApi3_Schema,
} from './helpers';
import { JsDoc } from './JsDoc';
import { Named } from './Named';
import { Schemata } from './Schemata';
import type { PrinterOptions, RequestStatusCodeMatch } from './types';

const allowMethods = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace'];

type RequestMediaMatch = (mediaType: string, media: OpenApi3_Media) => boolean;
type ResponseMediaMatch = (mediaType: string, media: OpenApi3_Media, response: OpenApi3.ResponseObject) => boolean;

type ResponseMatch = (statusCode: string, response: OpenApi3_Response) => boolean;

export class Printer {
    named = new Named();
    schemata = new Schemata(this.named);

    constructor(
        private readonly document: OpenApi3.Document,
        private options?: PrinterOptions,
    ) {
        const { openapi } = document;

        if (!openapi.startsWith('3.')) throw new Error(`当前仅支持 openapi 3.x，当前版本为 ${openapi}`);

        this.registerComponents();
        this.named.internalVarName(options?.axiosImportName || AXIOS_IMPORT_NAME);
    }

    registerComponents() {
        Object.entries(this.document.components?.schemas || {}).forEach(([name, schema]) => {
            // 指定引用 ID
            const id = schema.$id;
            this.named.nextTypeName(name, id || true);
        });
    }

    print() {
        return [
            //
            this.printInfo(),
            this.printImports(),
            this.printComponents(),
            this.printPaths(),
        ].join('\n');
    }

    printImports() {
        const {
            axiosImportName = AXIOS_IMPORT_NAME,
            axiosNamedImport: axiosNamedImport,
            axiosImportFile = AXIOS_IMPORT_FILE,
            axiosRequestConfigTypeName = AXIOS_QUEST_CONFIG_TYPE_NAME,
            axiosResponseTypeName = AXIOS_PROMISE_TYPE_NAME,
            baseURL,
        } = this.options || {};
        const firstServer = this.document.servers?.[0];
        const defaultBaseURL = firstServer?.url || '/';
        const BASE_URL = isString(baseURL) ? baseURL : baseURL?.(this.document) || defaultBaseURL;

        return (
            [
                //
                axiosNamedImport
                    ? // 具名导入
                      `import {${axiosImportName}} from "${axiosImportFile}";`
                    : // 默认导入
                      `import ${axiosImportName} from "${axiosImportFile}";`,
                `import type {${axiosRequestConfigTypeName}, ${axiosResponseTypeName}} from "${axiosImportFile}";`,
                `import {resolveURL} from "${pkgName}/client";`,
                `import type {OneOf} from "${pkgName}/client";`,
                '',
                `const BASE_URL=${JSON.stringify(BASE_URL)};`,
            ].join('\n') + '\n'
        );
    }

    printInfo() {
        const { contact, description, license, summary, termsOfService, title, version } = this.document.info;
        const { externalDocs } = this.document;
        const { name, email, url } = contact || {};
        const jsDoc = new JsDoc();
        const extDoc = JsDoc.printExternalDoc(externalDocs);
        jsDoc.addComments({
            title,
            version,
            contact: name || url || email ? [name, email ? `<${email}>` : '', url ? `(${url})` : ''].filter(Boolean).join(' ') : undefined,
            description,
            summary,
            see: extDoc,
        });
        return jsDoc.print() + '\n';
    }

    printComponents() {
        return (
            Object.entries(this.document.components?.schemas || {})
                .map(([name, schema]) => {
                    const id = schema.$id || `#/components/schemas/${name}`;
                    return this._printComponent(name, id, schema);
                })
                .join('\n\n') + '\n'
        );
    }

    private _printComponent(name: string, id: string, schema: OpenApi3_Schema) {
        const { comments, type } = this.schemata.print(schema);
        const jsDoc = new JsDoc();
        jsDoc.addComments(comments);
        const typeName = this.named.getRefType(id);

        return [jsDoc.print(), `export type ${typeName} = ${type};`].filter(Boolean).join('\n');
    }

    printPaths() {
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
        const headers = new Arg(argNamed, 'headers', this.schemata);
        const cookies = new Arg(argNamed, 'cookies', this.schemata);
        const params = new Arg(argNamed, 'params', this.schemata);
        const path = new Arg(argNamed, 'path', this.schemata);
        const data = new Arg(argNamed, 'data', this.schemata, true);
        const config = new Arg(argNamed, 'config', this.schemata, true);
        const resp = new Arg(argNamed, 'return', this.schemata, true);
        const { parameters, requestBody, responses, operationId } = operation;
        const { responseStatusCode, responseContentType, requestContentType } = this.options || {};

        parameters?.forEach((parameter) => {
            if (isRefParameter(parameter)) return;

            switch (parameter.in) {
                case 'query':
                    params.add(parameter);
                    break;
                case 'header':
                    headers.add(parameter);
                    break;
                case 'path':
                    path.add(parameter);
                    break;
                case 'cookie':
                    cookies.add(parameter);
                    break;
                default:
                    never(parameter.in);
            }
        });

        if (requestBody) {
            this._parseRequestBody(data, requestBody, (mediaType, content) => {
                if (isString(requestContentType)) return requestContentType === mediaType;
                if (!requestContentType) return true;

                return requestContentType(mediaType, {
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
                (mediaType, content, response) => {
                    if (isString(responseContentType)) return responseContentType === mediaType;
                    if (!responseContentType) return true;

                    return responseContentType(mediaType, {
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
        const requestArgs = new Args([headers.parse(), params.parse(), path.parse(), data.parse(), config.parse()]);
        const responseArgs = new Args([resp.parse()]);
        const respType = responseArgs.toType(0);
        const jsDoc = new JsDoc(this.document.tags);
        const comments = JsDoc.fromOperation(operation);
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

    private _parseContent(
        arg: Arg,
        content: { [mediaType: string]: OpenApi3.MediaTypeObject | OpenApi3.ReferenceObject },
        comments: {
            description?: string;
            required?: boolean;
        },
        match: RequestMediaMatch,
    ) {
        const media = Object.entries(content).find(([mediaType, media]) => {
            return match(mediaType, media);
        })?.[1];

        if (!media) return;

        if (isRefMedia(media)) {
            arg.add({
                ...comments,
                ...media,
            });
        } else {
            arg.add({
                in: 'query',
                name: '',
                ...comments,
                schema: media.schema,
                required: true,
            });
        }
    }

    private _parseRequestBody(arg: Arg, requestBody: OpenApi3_Request, match: RequestMediaMatch) {
        if (!requestBody) return;

        if (isRefRequest(requestBody)) {
            return arg.add(requestBody);
        }

        this._parseContent(arg, requestBody.content, requestBody, match);
    }

    private _parseResponses(arg: Arg, responses: OpenApi3.ResponsesObject, responseMatch: ResponseMatch, mediaMatch: ResponseMediaMatch) {
        const { responseStatusCode } = this.options || {};
        const response = Object.entries(responses).find(([statusCode, response]) => {
            return responseMatch(statusCode, response);
        })?.[1];

        if (!response) return;

        if (isRefResponse(response)) {
            return arg.add(response);
        }

        if (response.content) {
            this._parseContent(arg, response.content, response, (mediaType, media) => mediaMatch(mediaType, media, response));
        }
    }
}
