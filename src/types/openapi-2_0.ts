/* eslint-disable ts/no-empty-object-type */

export interface Document<T extends {} = {}> {
  'basePath'?: string;
  'consumes'?: MimeTypes;
  'definitions'?: DefinitionsObject;
  'externalDocs'?: ExternalDocumentationObject;
  'host'?: string;
  'info': InfoObject;
  'parameters'?: ParametersDefinitionsObject;
  'paths': PathsObject<T>;
  'produces'?: MimeTypes;
  'responses'?: ResponsesDefinitionsObject;
  'schemes'?: string[];
  'security'?: SecurityRequirementObject[];
  'securityDefinitions'?: SecurityDefinitionsObject;
  'swagger': string;
  'tags'?: TagObject[];
  'x-express-openapi-additional-middleware'?: (
        | ((request: any, response: any, next: any) => Promise<void>)
        | ((request: any, response: any, next: any) => void)
  )[];
  'x-express-openapi-validation-strict'?: boolean;
}
export interface TagObject {
  name: string;
  description?: string;
  externalDocs?: ExternalDocumentationObject;
}
export interface SecuritySchemeObjectBase {
  type: 'basic' | 'apiKey' | 'oauth2';
  description?: string;
}
export interface SecuritySchemeBasic extends SecuritySchemeObjectBase {
  type: 'basic';
}
export interface SecuritySchemeApiKey extends SecuritySchemeObjectBase {
  type: 'apiKey';
  name: string;
  in: string;
}
export type SecuritySchemeOauth2 =
  | SecuritySchemeOauth2Implicit
  | SecuritySchemeOauth2AccessCode
  | SecuritySchemeOauth2Password
  | SecuritySchemeOauth2Application;
export interface ScopesObject {
  [index: string]: any;
}
export interface SecuritySchemeOauth2Base extends SecuritySchemeObjectBase {
  type: 'oauth2';
  flow: 'implicit' | 'password' | 'application' | 'accessCode';
  scopes: ScopesObject;
}
export interface SecuritySchemeOauth2Implicit extends SecuritySchemeOauth2Base {
  flow: 'implicit';
  authorizationUrl: string;
}
export interface SecuritySchemeOauth2AccessCode extends SecuritySchemeOauth2Base {
  flow: 'accessCode';
  authorizationUrl: string;
  tokenUrl: string;
}
export interface SecuritySchemeOauth2Password extends SecuritySchemeOauth2Base {
  flow: 'password';
  tokenUrl: string;
}
export interface SecuritySchemeOauth2Application extends SecuritySchemeOauth2Base {
  flow: 'application';
  tokenUrl: string;
}
export type SecuritySchemeObject = SecuritySchemeBasic | SecuritySchemeApiKey | SecuritySchemeOauth2;
export interface SecurityDefinitionsObject {
  [index: string]: SecuritySchemeObject;
}
export interface SecurityRequirementObject {
  [index: string]: string[];
}
export interface ReferenceObject {
  $ref: string;
}
export type Response = ResponseObject | ReferenceObject;
export interface ResponsesDefinitionsObject {
  [index: string]: ResponseObject;
}
export type Schema = SchemaObject | ReferenceObject;
export interface ResponseObject {
  description: string;
  schema?: Schema;
  headers?: HeadersObject;
  examples?: ExampleObject;
}
export interface HeadersObject {
  [index: string]: HeaderObject;
}
export interface HeaderObject extends ItemsObject {
  description?: string;
}
export interface ExampleObject {
  [index: string]: any;
}
export interface ResponseObject {
  description: string;
  schema?: Schema;
  headers?: HeadersObject;
  examples?: ExampleObject;
}
export type OperationObject<T extends {} = {}> = {
  tags?: string[];
  summary?: string;
  description?: string;
  externalDocs?: ExternalDocumentationObject;
  operationId?: string;
  consumes?: MimeTypes;
  produces?: MimeTypes;
  parameters?: Parameters;
  responses: ResponsesObject;
  schemes?: string[];
  deprecated?: boolean;
  security?: SecurityRequirementObject[];
} & T;
export interface ResponsesObject {
  [index: string]: Response | undefined;
  default?: Response;
}
export type Parameters = (ReferenceObject | Parameter)[];
export type Parameter = InBodyParameterObject | GeneralParameterObject;
export interface InBodyParameterObject extends Omit<ParameterObject, 'in'> {
  in: 'body';
  schema: Schema;
}
export interface GeneralParameterObject extends ParameterObject, ItemsObject {
  allowEmptyValue?: boolean;
}
export enum HttpMethods {
  GET = 'get',
  PUT = 'put',
  POST = 'post',
  DELETE = 'delete',
  OPTIONS = 'options',
  HEAD = 'head',
  PATCH = 'patch',
}
export type PathItemObject<T extends {} = {}> = {
  $ref?: string;
  parameters?: Parameters;
} & {
  [method in HttpMethods]?: OperationObject<T>;
};
export interface PathsObject<T extends {} = {}> {
  [index: string]: PathItemObject<T>;
}
export interface ParametersDefinitionsObject {
  [index: string]: ParameterObject;
}
export interface ParameterObject {
  name: string;
  in: 'query' | 'header' | 'path' | 'cookie' | 'formData';
  description?: string;
  required?: boolean;
  [index: string]: any;
}
export type MimeTypes = string[];
export interface DefinitionsObject {
  [index: string]: SchemaObject;
}
export interface SchemaObject {
  id?: string;
  $schema?: string;
  title?: string;
  description?: string;
  multipleOf?: number;
  maximum?: number;
  exclusiveMaximum?: boolean;
  minimum?: number;
  exclusiveMinimum?: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  additionalItems?: boolean | SchemaObject;
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
  maxProperties?: number;
  minProperties?: number;
  required?: string[];
  additionalProperties?: boolean | SchemaObject;
  definitions?: {
    [name: string]: SchemaObject;
  };
  items?: ItemsObject | ReferenceObject;
  properties?: {
    [name: string]: SchemaObject;
  };
  patternProperties?: {
    [name: string]: SchemaObject;
  };
  dependencies?: {
    [name: string]: SchemaObject | string[];
  };
  enum?: any[];
  type?: 'string' | 'number' | 'integer' | 'boolean' | 'object' | 'array' | 'file';
  format?: string;
  allOf?: SchemaObject[];
  anyOf?: SchemaObject[];
  oneOf?: SchemaObject[];
  not?: SchemaObject;
  $ref?: string;
  [index: string]: any;
  discriminator?: string;
  readOnly?: boolean;
  xml?: XMLObject;
  externalDocs?: ExternalDocumentationObject;
  example?: any;
  default?: any;
}
export interface ExternalDocumentationObject {
  [index: string]: any;
  description?: string;
  url: string;
}
export interface ItemsObject {
  type?: 'string' | 'number' | 'integer' | 'boolean' | 'object' | 'array' | 'file';
  format?: string;
  items?: ItemsObject | ReferenceObject;
  collectionFormat?: 'csv' | 'ssv' | 'tsv' | 'pipes' | 'multi';
  default?: any;
  maximum?: number;
  exclusiveMaximum?: boolean;
  minimum?: number;
  exclusiveMinimum?: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
  enum?: any[];
  multipleOf?: number;
  $ref?: string;
}
export interface XMLObject {
  [index: string]: any;
  name?: string;
  namespace?: string;
  prefix?: string;
  attribute?: boolean;
  wrapped?: boolean;
}
export interface InfoObject {
  title: string;
  description?: string;
  termsOfService?: string;
  contact?: ContactObject;
  license?: LicenseObject;
  version: string;
}
export interface ContactObject {
  name?: string;
  url?: string;
  email?: string;
}
export interface LicenseObject {
  name: string;
  url?: string;
}
