import type { PrinterConfigs, PrinterOptions } from './types';
import { type OpenAPILatest, OpenAPIVersion } from '../types/openapi';
import { toRelative } from '../utils/path';
import { isString, isUndefined } from '../utils/type-is';
import { Arg } from './Arg';
import { Args } from './Args';
import { AXIOS_IMPORT_FILE, AXIOS_IMPORT_NAME, AXIOS_PROMISE_TYPE_NAME, AXIOS_QUEST_CONFIG_TYPE_NAME, AXIOS_TYPE_IMPORT_FILE } from './const';
import {
  filterLine,
  isRefMedia,
  isRefOperation,
  isRefParameter,
  isRefPathItem,
  isRefRequest,
  isRefResponse,
  isRefSchema,
  type OpenApiLatest_Media,
  type OpenApiLatest_Operation,
  type OpenApiLatest_Parameter,
  type OpenApiLatest_PathItem,
  type OpenApiLatest_Request,
  type OpenApiLatest_Response,
  type OpenApiLatest_Schema,
  toImportString,
} from './helpers';
import { JsDoc } from './JsDoc';
import { Named } from './Named';
import { Schemata } from './Schemata';

const allowMethods = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace'];
const parameterTypes = ['query', 'header', 'path', 'cookie'];

type RequestMediaMatch = (contentType: string, content: OpenApiLatest_Media) => boolean;
type ResponseMediaMatch = (contentType: string, content: OpenApiLatest_Media, response: OpenAPILatest.ResponseObject) => boolean;

type ResponseMatch = (statusCode: string, response: OpenApiLatest_Response) => boolean;

export class Printer {
  named = new Named({ internalVars: true, internalTypes: true });
  schemata = new Schemata(this.named);
  private configs: PrinterConfigs = {};

  constructor(
    private readonly document: OpenAPILatest.Document,
    private options?: PrinterOptions,
  ) {
    const { openapi } = document;

    if (!openapi)
      throw new Error(`未找到 openapi 版本号`);
    if (!openapi.startsWith(OpenAPIVersion.V3_1))
      throw new Error(`当前仅支持 openapi ${OpenAPIVersion.V3_1}，当前版本为 ${openapi}`);

    this.registerComponents();
  }

  schemas: Record<string /** refId */, string /** refType */> = {};
  anchors: Record<string /** anchorId */, string /** anchorType */> = {};
  requestBodies: Record<string, OpenApiLatest_Request> = {};
  parameters: Record<string, OpenApiLatest_Parameter> = {};
  responses: Record<string, OpenApiLatest_Response> = {};
  pathItems: Record<string, OpenApiLatest_PathItem> = {};
  registerComponents() {
    const { schemas = {}, requestBodies = {}, parameters = {}, responses = {}, pathItems = {} } = this.document.components || {};

    Object.entries(schemas).forEach(([name, schema]) => {
      const id = isRefSchema(schema) ? schema.$ref : schema.$id || `#/components/schemas/${name}`;

      if (this.schemas[id]) {
        throw new Error(`重复的 schema 引用 id：${id}`);
      }

      const refType = this.named.nextRefType(name, id);
      this.schemas[id] = refType;
      this._registerAnchors(id, refType, schema, []);
    });

    Object.entries(requestBodies).forEach(([name, requestBody]) => {
      const defaultId = `#/components/requestBodies/${name}`;
      const id = isRefRequest(requestBody) ? defaultId : requestBody.$id || defaultId;

      if (this.requestBodies[id]) {
        throw new Error(`重复的 requestBody 引用 id：${id}`);
      }

      this.requestBodies[id] = requestBody;
    });

    Object.entries(parameters).forEach(([name, parameter]) => {
      const defaultId = `#/components/parameters/${name}`;
      const id = isRefParameter(parameter) ? defaultId : parameter.$id || defaultId;

      if (this.parameters[id]) {
        throw new Error(`重复的 parameter 引用 id：${id}`);
      }

      this.parameters[id] = parameter;
    });

    Object.entries(responses).forEach(([name, response]) => {
      const defaultId = `#/components/responses/${name}`;
      const id = isRefResponse(response) ? defaultId : response.$id || defaultId;

      if (this.responses[id]) {
        throw new Error(`重复的 response 引用 id：${id}`);
      }

      this.responses[id] = response;
    });

    Object.entries(pathItems).forEach(([name, pathItem]) => {
      const defaultId = `#/components/pathItems/${name}`;
      const id = isRefPathItem(pathItem) ? defaultId : pathItem.$id || defaultId;

      if (this.pathItems[id]) {
        throw new Error(`重复的 pathItem 引用 id：${id}`);
      }

      this.pathItems[id] = pathItem;
    });
  }

  private _registerAnchors(rootId: string, rootType: string, schema: OpenApiLatest_Schema, props: string[]) {
    if (isRefSchema(schema))
      return;

    if (props.length && schema.$anchor) {
      const anchorId = `${rootId}#${schema.$anchor}`;
      const anchorType = `DeepGet<${rootType}, [${props.join(', ')}]>`;

      if (this.anchors[anchorId]) {
        throw new Error(`重复的 anchor 引用 id：${anchorId}`);
      }

      this.anchors[anchorId] = anchorType;
      this.named.refIdTypeMap.set(anchorId, anchorType);
    }

    if ('items' in schema && schema.items) {
      this._registerAnchors(rootId, rootType, schema.items, [...props, 'number']);
    }
    else if ('properties' in schema && schema.properties) {
      Object.entries(schema.properties).forEach(([prop, property]) => {
        this._registerAnchors(rootId, rootType, property, [...props, JSON.stringify(prop)]);
      });
    }
  }

  print(configs?: PrinterConfigs) {
    Object.assign(this.configs, configs);
    const { hideHeaders, hideHelpers, hideFooters, hideInfo, hideComponents, hideImports, hidePaths } = this.configs;
    const header = (this.options?.header || '');
    const footer = (this.options?.footer || '');

    return [
      !hideHeaders && header,
      !hideInfo && this._printInfo(),
      !hideImports && this._printImports(),
      !hideHelpers && Printer.helpersCode,
      !hideComponents && this._printComponents(),
      !hidePaths && this._printPaths(),
      !hideFooters && footer,
    ]
      .filter(Boolean)
      .join('\n\n');
  }

  private _printInfo() {
    const { contact, description, license, summary, termsOfService, title, version } = this.document.info;
    const { externalDocs } = this.document;
    const { name, email, url } = contact || {};
    const jsDoc = new JsDoc();
    const { module } = this.configs;
    if (module)
      jsDoc.addComments({ module });
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

  private _printImports() {
    const {
      axiosImportName = AXIOS_IMPORT_NAME,
      axiosImportFile = AXIOS_IMPORT_FILE,
      axiosTypeImportFile = AXIOS_TYPE_IMPORT_FILE,
      axiosRequestConfigTypeName = AXIOS_QUEST_CONFIG_TYPE_NAME,
      axiosResponseTypeName = AXIOS_PROMISE_TYPE_NAME,
    } = this.options || {};
    const { file } = this.configs;
    const importPath = toRelative(axiosImportFile, file);
    const importTypePath = toRelative(axiosTypeImportFile, file);

    return [
      toImportString(AXIOS_IMPORT_NAME, axiosImportName, importPath),
      toImportString(AXIOS_QUEST_CONFIG_TYPE_NAME, axiosRequestConfigTypeName, importTypePath, true),
      toImportString(AXIOS_PROMISE_TYPE_NAME, axiosResponseTypeName, importTypePath, true),
      '',
    ].join('\n');
  }

  private _printComponents() {
    return Object.entries(this.document.components?.schemas || {})
      .map(([name, schema]) => {
        const defaultId = `#/components/schemas/${name}`;
        const id = isRefSchema(schema) ? defaultId : schema.$id || defaultId;
        return this._printComponent(name, id, schema);
      })
      .join('\n\n');
  }

  private _printComponent(name: string, id: string, schema: OpenApiLatest_Schema) {
    const { comments, type } = this.schemata.print(schema);
    const jsDoc = new JsDoc();
    jsDoc.addComments(comments);
    const refType = this.schemas[id];

    if (isUndefined(refType)) {
      throw new Error(`未发现 schema 引用：${id}`);
    }

    return [jsDoc.print(), `export type ${refType} = ${type};`].filter(Boolean).join('\n');
  }

  private _printPaths() {
    return Object.entries(this.document.paths || {})
      .map(([url, pathItem]) => {
        return this._printPathItem(url, pathItem).filter(filterLine).join('\n\n');
      })
      .join('\n\n');
  }

  private _printPathItem(url: string, pathItem: OpenApiLatest_PathItem): Array<string | undefined> {
    if (isRefPathItem(pathItem)) {
      const relPathItem = this.pathItems[pathItem.$ref];

      if (isUndefined(relPathItem)) {
        throw new Error(`未发现 pathItem 引用：${pathItem.$ref}`);
      }

      return this._printPathItem(url, relPathItem);
    }

    return Object.entries(pathItem).map(([method, _operation]) => {
      // method === 'parameters'，migration 已忽略

      const isOperation = allowMethods.includes(method);
      if (!isOperation)
        return undefined;

      // 转换后可能有 undefined 的情况
      if (isUndefined(_operation))
        return undefined;

      // 已经约束了是 http method
      const operation = _operation as OpenApiLatest_Operation;
      return this._printOperation(method, url, operation);
    });
  }

  private _printOperation(method: string, url: string, operation: OpenApiLatest_Operation) {
    if (isRefOperation(operation))
      return;

    const options = this.options || {};
    const { responseStatusCode, responseContentType, requestContentType } = options;
    const argNamed = new Named({ keywordVars: true, internalVars: true, internalTypes: true });
    const header = new Arg(argNamed, 'header', this.schemata, options);
    const cookie = new Arg(argNamed, 'cookie', this.schemata, options);
    const query = new Arg(argNamed, 'param', this.schemata, options);
    const path = new Arg(argNamed, 'path', this.schemata, options);
    path.setUrl(url); // 设置 url，用于解析 path 参数
    const data = new Arg(argNamed, 'data', this.schemata, options, true);
    const config = new Arg(argNamed, 'config', this.schemata, options, true);
    config.setDefaultType(AXIOS_QUEST_CONFIG_TYPE_NAME);
    const resp = new Arg(argNamed, 'response', this.schemata, options, true);
    const { parameters, requestBody, responses, operationId } = operation;

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
        if (isString(requestContentType))
          return requestContentType === contentType;
        if (!requestContentType)
          return true;

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
          if (isString(responseStatusCode))
            return responseStatusCode === statusCode;
          if (!responseStatusCode)
            return statusCode.startsWith('2');

          return responseStatusCode(statusCode, {
            method,
            url,
            operation,
            response,
            responses,
          });
        },
        (contentType, content, response) => {
          if (isString(responseContentType))
            return responseContentType === contentType;
          if (!responseContentType)
            return true;

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
    const requestArgs = new Args([header.parse(), path.parse(), query.parse(), data.parse(), config.parse()]);
    const responseArgs = new Args([resp.parse()]);
    const respType = responseArgs.toType(0);
    const jsDoc = new JsDoc(this.document.tags);
    const comments = JsDoc.fromOperation(operation);
    const { module } = this.configs;
    if (module)
      jsDoc.addComments({ module });
    jsDoc.addComments(comments);
    jsDoc.addComments(requestArgs.toComments());
    jsDoc.addComments(responseArgs.toComments());

    return `${jsDoc.print()}
export async function ${funcName}(${requestArgs.toArgs()}): ${AXIOS_PROMISE_TYPE_NAME}<${respType}> {
    return ${AXIOS_IMPORT_NAME}({
        method: ${JSON.stringify(method)},
        ${requestArgs.toValues()}
    });
}`;
  }

  private _parseContents(
    arg: Arg,
    contents: { [contentType: string]: OpenAPILatest.MediaTypeObject | OpenAPILatest.ReferenceObject },
    comments: {
      description?: string;
      required?: boolean;
    },
    match: RequestMediaMatch,
  ) {
    const content = Object.entries(contents).find(([contentType, content]) => {
      return match(contentType, content);
    })?.[1];

    if (!content)
      return;

    this._parseContent(arg, content, comments);
  }

  private _parseContent(
    arg: Arg,
    content: OpenApiLatest_Media,
    comments: {
      description?: string;
      required?: boolean;
    },
  ) {
    if (isRefMedia(content)) {
      const { $ref } = content;
      const label = arg.kind === 'response' ? '响应' : '请求';

      throw new Error(`不支持引用${label}内容：${$ref}`);
    }
    else {
      arg.add({
        in: 'query',
        name: 'data',
        ...comments,
        schema: content.schema,
        required: true,
      });
    }
  }

  private _parseParameter(parameter: OpenApiLatest_Parameter, args: Record<OpenAPILatest.ParameterObject['in'], Arg>) {
    if (isRefParameter(parameter)) {
      const { $ref } = parameter;
      const refParameter = this.parameters[$ref];

      if (!refParameter) {
        throw new Error(`未发现 parameter 引用：${$ref}`);
      }

      this._parseParameter(refParameter, args);
      return;
    }

    if (parameterTypes.includes(parameter.in)) {
      args[parameter.in].add(parameter);
    }
  }

  private _parseRequestBody(arg: Arg, requestBody: OpenApiLatest_Request, match: RequestMediaMatch) {
    if (!requestBody)
      return;

    if (isRefRequest(requestBody)) {
      const { $ref } = requestBody;
      const refRequestBody = this.requestBodies[$ref];

      if (!refRequestBody)
        throw new Error(`未发现 requestBody 引用：${$ref}`);

      this._parseRequestBody(arg, refRequestBody, match);
      return;
    }

    this._parseContents(arg, requestBody.content, requestBody, match);
  }

  private _parseResponses(arg: Arg, responses: OpenAPILatest.ResponsesObject, responseMatch: ResponseMatch, contentMatch: ResponseMediaMatch) {
    const response = Object.entries(responses).find(([statusCode, response]) => {
      return responseMatch(statusCode, response);
    })?.[1];

    if (!response)
      return;

    this._parseResponse(arg, response, contentMatch);
  }

  private _parseResponse(arg: Arg, response: OpenApiLatest_Response, contentMatch: ResponseMediaMatch) {
    if (isRefResponse(response)) {
      const { $ref } = response;
      const refResponse = this.responses[$ref];

      if (!refResponse)
        throw new Error(`未发现 response 引用：${$ref}`);

      this._parseResponse(arg, refResponse, contentMatch);
      return;
    }

    const { content } = response;
    if (!content)
      return;

    this._parseContents(arg, content, response, (contentType, content) => contentMatch(contentType, content, response));
  }

  static helpersCode = `
// helpers --- start
type OneOf<T extends unknown[]> = T extends [infer A, ...infer B] ? A | OneOf<B> : never;
type AllOf<T extends unknown[]> = T extends [infer A, ...infer B] ? A & AllOf<B> : unknown;
type AnyOf<T extends unknown[]> = T extends [infer A, ...infer B] ? A | AnyOf<B> | (A & AnyOf<B>) : never;
type UnknownObject = Record<string, unknown>;
type DeepGet<O, K> = K extends [infer P, ...infer R]
  ? O extends Record<string, any> | Array<any>
    ? P extends keyof O
      ? R['length'] extends 0
        ? O[P]
        : DeepGet<NonNullable<O[P]>, R>
      : never
    : never
  : never;
// helpers --- end
    `;
}

// helpers --- start
type OneOf<T extends unknown[]> = T extends [infer A, ...infer B] ? A | OneOf<B> : never;
type AllOf<T extends unknown[]> = T extends [infer A, ...infer B] ? A & AllOf<B> : unknown;
type AnyOf<T extends unknown[]> = T extends [infer A, ...infer B] ? A | AnyOf<B> | (A & AnyOf<B>) : never;
type UnknownObject = Record<string, unknown>;
type DeepGet<O, K> = K extends [infer P, ...infer R]
  ? O extends Record<string, any> | Array<any>
    ? P extends keyof O
      ? R['length'] extends 0
        ? O[P]
        : DeepGet<NonNullable<O[P]>, R>
      : never
    : never
  : never;
// helpers --- end

interface T0 {
  aa?: string;
  bb?: {
    cc?: T0['aa'];
    dd?: number;
  }[];
}
interface T1 {
  aa?: DeepGet<T0, ['aa']>;
  dd?: DeepGet<T0, ['bb', number, 'dd']>;
}
const t1: T1 = {
  aa: 'aa',
  dd: 1,
};
