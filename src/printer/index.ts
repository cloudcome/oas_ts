import type { OpenAPILatest } from '../types/openapi';
import type { OpenApiLatest_Media, OpenApiLatest_Operation, OpenApiLatest_Parameter, OpenApiLatest_PathItem, OpenApiLatest_Request, OpenApiLatest_Response, OpenApiLatest_Schema } from './helpers';
import type { PrinterConfigs, PrinterOptions } from './types';
import { OpenAPIVersion } from '../types/openapi';
import { toImportPath } from '../utils/path';
import { isString, isUndefined } from '../utils/type-is';
import { Arg } from './Arg';
import { Args } from './Args';
import {
  AXIOS_IMPORT_FILE,
  AXIOS_IMPORT_NAME,
  AXIOS_REQUEST_TYPE_NAME,
  AXIOS_RESPONSE_TYPE_NAME,
  AXIOS_TYPE_IMPORT_FILE,
} from './const';
import {
  filterLine,
  isRefMedia,
  isRefOperation,
  isRefParameter,
  isRefPathItem,
  isRefRequest,
  isRefResponse,
  isRefSchema,

  toImportString,
} from './helpers';
import { JsDoc } from './JsDoc';
import { Named } from './Named';
import { Schemata } from './Schemata';

const allowMethods = [
  'get',
  'put',
  'post',
  'delete',
  'options',
  'head',
  'patch',
  'trace',
];
const parameterTypes = ['query', 'header', 'path', 'cookie'];

type RequestMediaMatch = (
  contentType: string,
  content: OpenApiLatest_Media,
) => boolean;
type ResponseMediaMatch = (
  contentType: string,
  content: OpenApiLatest_Media,
  response: OpenAPILatest.ResponseObject,
) => boolean;

type ResponseMatch = (
  statusCode: string,
  response: OpenApiLatest_Response,
) => boolean;

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
      throw new Error('未找到 openapi 版本号');
    if (!openapi.startsWith(OpenAPIVersion.V3_1)) {
      throw new Error(
        `当前仅支持 openapi ${OpenAPIVersion.V3_1}，当前版本为 ${openapi}`,
      );
    }

    this.registerComponents();
  }

  schemas: Record<string /** refId */, string /** refType */> = {};
  anchors: Record<string /** anchorId */, string /** anchorType */> = {};
  requestBodies: Record<string, OpenApiLatest_Request> = {};
  parameters: Record<string, OpenApiLatest_Parameter> = {};
  responses: Record<string, OpenApiLatest_Response> = {};
  pathItems: Record<string, OpenApiLatest_PathItem> = {};

  #parseRefComponent<T>(
    { kind, name, obj, primary, additional }: {
      kind: keyof OpenAPILatest.ComponentsObject;
      name: string;
      obj: { $ref: string } | { $id?: string };
      primary: (id: string) => T;
      additional?: ((id: string, val: T) => void) | true;
    },
  ) {
    const nodeId = `#/components/${kind}/${name}`;
    const refId = '$ref' in obj ? obj.$ref : '';
    const namedId = '$ref' in obj ? '' : obj.$id;

    if (refId === nodeId) {
      throw new Error(`${kind}/${name} 引用了自身`);
    }

    const val = primary(nodeId);

    if (namedId && namedId !== nodeId) {
      if (additional === true) {
        primary(namedId);
      }
      else {
        additional?.(namedId, val);
      }
    }
  }

  registerComponents() {
    const {
      schemas = {},
      requestBodies = {},
      parameters = {},
      responses = {},
      pathItems = {},
    } = this.document.components || {};

    for (const [name, schema] of Object.entries(schemas)) {
      this.#parseRefComponent({
        kind: 'schemas',
        name,
        obj: schema,
        primary: (id) => {
          if (this.schemas[id]) {
            throw new Error(`重复的 schema 引用 id：${id}`);
          }

          const refType = this.named.nextRefType(name, id);
          this.schemas[id] = refType;
          this.#registerAnchors(id, refType, schema, []);
          return refType;
        },
        additional: (id, refType) => {
          this.schemas[id] = refType;
          this.named.setRefType(id, refType);
          this.#registerAnchors(id, refType, schema, []);
        },
      });
    }

    for (const [name, requestBody] of Object.entries(requestBodies)) {
      const defaultId = `#/components/requestBodies/${name}`;
      const overrideId = isRefRequest(requestBody)
        ? defaultId
        : requestBody.$id || defaultId;

      this.#parseRefComponent({
        kind: 'requestBodies',
        name,
        obj: requestBody,
        primary: (id) => {
          if (this.requestBodies[id]) {
            throw new Error(`重复的 requestBody 引用 id：${id}`);
          }
          this.requestBodies[id] = requestBody;
        },
        additional: true,
      });
    }

    for (const [name, parameter] of Object.entries(parameters)) {
      const defaultId = `#/components/parameters/${name}`;
      const overrideId = isRefParameter(parameter)
        ? defaultId
        : parameter.$id || defaultId;

      this.#parseRefComponent({
        kind: 'parameters',
        name,
        obj: parameter,
        primary: (id) => {
          if (this.parameters[id]) {
            throw new Error(`重复的 parameter 引用 id：${id}`);
          }
          this.parameters[id] = parameter;
        },
        additional: true,
      });
    }

    for (const [name, response] of Object.entries(responses)) {
      const defaultId = `#/components/responses/${name}`;
      const overrideId = isRefResponse(response)
        ? defaultId
        : response.$id || defaultId;

      this.#parseRefComponent({
        kind: 'responses',
        name,
        obj: response,
        primary: (id) => {
          if (this.responses[overrideId]) {
            throw new Error(`重复的 response 引用 id：${overrideId}`);
          }

          this.responses[id] = response;
        },
        additional: true,
      });
    }

    for (const [name, pathItem] of Object.entries(pathItems)) {
      const defaultId = `#/components/pathItems/${name}`;
      const overrideId = isRefPathItem(pathItem)
        ? defaultId
        : pathItem.$id || defaultId;

      this.#parseRefComponent({
        kind: 'pathItems',
        name,
        obj: pathItem,
        primary: (id) => {
          if (this.pathItems[id]) {
            throw new Error(`重复的 pathItem 引用 id：${id}`);
          }

          this.pathItems[id] = pathItem;
        },
        additional: true,
      });
    }
  }

  #registerAnchors(
    rootId: string,
    rootType: string,
    schema: OpenApiLatest_Schema,
    props: string[],
  ) {
    if (isRefSchema(schema))
      return;

    if (props.length && schema.$anchor) {
      const anchorId = `${rootId}#${schema.$anchor}`;
      const anchorType = `DeepGet<${rootType}, [${props.join(', ')}]>`;

      if (this.anchors[anchorId]) {
        throw new Error(`重复的 anchor 引用 id：${anchorId}`);
      }

      this.anchors[anchorId] = anchorType;
      this.named.setRefType(anchorId, anchorType);
    }

    if ('items' in schema && schema.items) {
      this.#registerAnchors(rootId, rootType, schema.items, [
        ...props,
        'number',
      ]);
    }
    else if ('properties' in schema && schema.properties) {
      for (const [prop, property] of Object.entries(schema.properties)) {
        this.#registerAnchors(rootId, rootType, property, [
          ...props,
          JSON.stringify(prop),
        ]);
      }
    }
  }

  print(configs?: PrinterConfigs) {
    Object.assign(this.configs, configs);
    const {
      hideHeaders,
      hideHelpers,
      hideFooters,
      hideInfo,
      hideComponents,
      hideImports,
      hidePaths,
    } = this.configs;
    const header = this.options?.header || '';
    const footer = this.options?.footer || '';

    return [
      !hideHeaders && header,
      !hideInfo && this.#printInfo(),
      !hideImports && this.#printImports(),
      !hideHelpers && Printer.helpersCode,
      !hideComponents && this.#printComponents(),
      !hidePaths && this.#printPaths(),
      !hideFooters && footer,
    ]
      .filter(Boolean)
      .join('\n\n');
  }

  #printInfo() {
    const {
      contact,
      description,
      license,
      summary,
      termsOfService,
      title,
      version,
    } = this.document.info;
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
      contact:
        name || url || email
          ? [name, email ? `<${email}>` : '', url ? `(${url})` : '']
              .filter(Boolean)
              .join(' ')
          : undefined,
      description,
      summary,
      see: extDoc,
    });
    return jsDoc.print();
  }

  #printImports() {
    const {
      axiosImportName = '',
      axiosImportFile,
      axiosTypeImportFile,
      axiosRequestConfigTypeName = AXIOS_REQUEST_TYPE_NAME,
      axiosResponseTypeName = AXIOS_RESPONSE_TYPE_NAME,
    } = this.options || {};
    const { cwd = '/', file } = this.configs;
    const axiosImportFile2 = axiosImportFile || AXIOS_IMPORT_FILE;
    const importPath = toImportPath(axiosImportFile2, cwd, file);
    const axiosTypeImportFile2 = axiosTypeImportFile || axiosImportFile || AXIOS_TYPE_IMPORT_FILE;
    const importTypePath = toImportPath(axiosTypeImportFile2, cwd, file);

    return [
      toImportString(AXIOS_IMPORT_NAME, axiosImportName, importPath),
      toImportString(
        AXIOS_REQUEST_TYPE_NAME,
        axiosRequestConfigTypeName,
        importTypePath,
        true,
      ),
      toImportString(
        AXIOS_RESPONSE_TYPE_NAME,
        axiosResponseTypeName,
        importTypePath,
        true,
      ),
      '',
    ].join('\n');
  }

  #printComponents() {
    return Object.entries(this.document.components?.schemas || {})
      .map(([name, schema]) => {
        return this.#printComponent(
          name,
          `#/components/schemas/${name}`,
          schema,
        );
      })
      .join('\n\n');
  }

  #printComponent(
    name: string,
    id: string,
    schema: OpenApiLatest_Schema,
  ) {
    const { comments, type } = this.schemata.print(schema);
    const jsDoc = new JsDoc();
    jsDoc.addComments(comments);
    const refType = this.schemas[id];

    if (isUndefined(refType)) {
      throw new Error(`未发现 schema 引用：${id}`);
    }

    return [jsDoc.print(), `export type ${refType} = ${type};`]
      .filter(Boolean)
      .join('\n');
  }

  #printPaths() {
    return Object.entries(this.document.paths || {})
      .map(([url, pathItem]) => {
        return this.#printPathItem(url, pathItem)
          .filter(filterLine)
          .join('\n\n');
      })
      .join('\n\n');
  }

  #printPathItem(
    url: string,
    pathItem: OpenApiLatest_PathItem,
  ): Array<string | undefined> {
    if (isRefPathItem(pathItem)) {
      const relPathItem = this.pathItems[pathItem.$ref];

      if (isUndefined(relPathItem)) {
        throw new Error(`未发现 pathItem 引用：${pathItem.$ref}`);
      }

      return this.#printPathItem(url, relPathItem);
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
      return this.#printOperation(method, url, operation);
    });
  }

  #printOperation(
    method: string,
    url: string,
    operation: OpenApiLatest_Operation,
  ) {
    if (isRefOperation(operation))
      return;

    const options = this.options || {};
    const { responseStatusCode, responseContentType, requestContentType } = options;
    const argNamed = new Named({
      keywordVars: true,
      internalVars: true,
      internalTypes: true,
    });
    const header = new Arg(argNamed, 'header', this.schemata, options);
    const cookie = new Arg(argNamed, 'cookie', this.schemata, options);
    const query = new Arg(argNamed, 'param', this.schemata, options);
    const path = new Arg(argNamed, 'path', this.schemata, options);
    path.setUrl(url); // 设置 url，用于解析 path 参数
    const data = new Arg(argNamed, 'data', this.schemata, options, true);
    const config = new Arg(argNamed, 'config', this.schemata, options, true);
    config.setDefaultType(AXIOS_REQUEST_TYPE_NAME);
    const resp = new Arg(argNamed, 'response', this.schemata, options, true);
    const { parameters, requestBody, responses, operationId } = operation;

    if (parameters) {
      for (const parameter of parameters) {
        this.#parseParameter(parameter, {
          header,
          cookie,
          path,
          query,
        });
      }
    }

    if (requestBody) {
      this.#parseRequestBody(data, requestBody, (contentType, content) => {
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
      this.#parseResponses(
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
    const requestArgs = new Args([
      header.parse(),
      path.parse(),
      query.parse(),
      data.parse(),
      config.parse(),
    ]);
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
export async function ${funcName}(${requestArgs.toArgs()}): ${AXIOS_RESPONSE_TYPE_NAME}<${respType}> {
    return ${AXIOS_IMPORT_NAME}({
        method: ${JSON.stringify(method.toUpperCase())},
        ${requestArgs.toValues()}
    });
}`;
  }

  #parseContents(
    arg: Arg,
    contents: {
      [contentType: string]:
        | OpenAPILatest.MediaTypeObject
        | OpenAPILatest.ReferenceObject;
    },
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

    this.#parseContent(arg, content, comments);
  }

  #parseContent(
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

    arg.add({
      in: 'query',
      name: 'data',
      ...comments,
      schema: content.schema,
      required: true,
    });
  }

  #parseParameter(
    parameter: OpenApiLatest_Parameter,
    args: Record<OpenAPILatest.ParameterObject['in'], Arg>,
  ) {
    if (isRefParameter(parameter)) {
      const { $ref } = parameter;
      const refParameter = this.parameters[$ref];

      if (!refParameter) {
        throw new Error(`未发现 parameter 引用：${$ref}`);
      }

      this.#parseParameter(refParameter, args);
      return;
    }

    if (parameterTypes.includes(parameter.in)) {
      args[parameter.in].add(parameter);
    }
  }

  #parseRequestBody(
    arg: Arg,
    requestBody: OpenApiLatest_Request,
    match: RequestMediaMatch,
  ) {
    if (!requestBody)
      return;

    if (isRefRequest(requestBody)) {
      const { $ref } = requestBody;
      const refRequestBody = this.requestBodies[$ref];

      if (!refRequestBody)
        throw new Error(`未发现 requestBody 引用：${$ref}`);

      this.#parseRequestBody(arg, refRequestBody, match);
      return;
    }

    this.#parseContents(arg, requestBody.content, requestBody, match);
  }

  #parseResponses(
    arg: Arg,
    responses: OpenAPILatest.ResponsesObject,
    responseMatch: ResponseMatch,
    contentMatch: ResponseMediaMatch,
  ) {
    const response = Object.entries(responses).find(
      ([statusCode, response]) => {
        return responseMatch(statusCode, response);
      },
    )?.[1];

    if (!response)
      return;

    this.#parseResponse(arg, response, contentMatch);
  }

  #parseResponse(
    arg: Arg,
    response: OpenApiLatest_Response,
    contentMatch: ResponseMediaMatch,
  ) {
    if (isRefResponse(response)) {
      const { $ref } = response;
      const refResponse = this.responses[$ref];

      if (!refResponse)
        throw new Error(`未发现 response 引用：${$ref}`);

      this.#parseResponse(arg, refResponse, contentMatch);
      return;
    }

    const { content } = response;
    if (!content)
      return;

    this.#parseContents(arg, content, response, (contentType, content) =>
      contentMatch(contentType, content, response));
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
type OneOf<T extends unknown[]> = T extends [infer A, ...infer B]
  ? A | OneOf<B>
  : never;
type AllOf<T extends unknown[]> = T extends [infer A, ...infer B]
  ? A & AllOf<B>
  : unknown;
type AnyOf<T extends unknown[]> = T extends [infer A, ...infer B]
  ? A | AnyOf<B> | (A & AnyOf<B>)
  : never;
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
