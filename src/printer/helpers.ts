import type { OpenApi3 } from '../types/openapi';
import { isString } from '../utils/type-is';

export type OpenApi3_Schema = OpenApi3.SchemaObject | OpenApi3.ReferenceObject;

export function isRefSchema(schema: OpenApi3_Schema): schema is OpenApi3.ReferenceObject {
    return '$ref' in schema;
}

export type OpenApi3_Parameter = OpenApi3.ReferenceObject | OpenApi3.ParameterObject;

export function isRefParameter(parameter: OpenApi3_Parameter): parameter is OpenApi3.ReferenceObject {
    return '$ref' in parameter;
}

export type OpenApi3_Request = OpenApi3.ReferenceObject | OpenApi3.RequestBodyObject;

export function isRefRequest(request: OpenApi3_Request): request is OpenApi3.ReferenceObject {
    return '$ref' in request;
}

export type OpenApi3_Media = OpenApi3.ReferenceObject | OpenApi3.MediaTypeObject;

export function isRefMedia(request: OpenApi3_Media): request is OpenApi3.ReferenceObject {
    return '$ref' in request;
}

export type OpenApi3_PathItem = OpenApi3.PathItemObject | OpenApi3.ReferenceObject;

export function isRefPathItem(pathItem: OpenApi3_PathItem): pathItem is OpenApi3.ReferenceObject {
    return '$ref' in pathItem;
}

export type OpenApi3_Operation = OpenApi3.OperationObject | OpenApi3.ReferenceObject;

export function isRefOperation(operation: OpenApi3_Operation): operation is OpenApi3.ReferenceObject {
    return '$ref' in operation;
}

export type OpenApi3_Response = OpenApi3.ResponseObject | OpenApi3.ReferenceObject;

export function isRefResponse(response: OpenApi3_Response): response is OpenApi3.ReferenceObject {
    return '$ref' in response;
}

export function filterLine(line: string | undefined) {
    return isString(line) ? true : false;
}

export function requiredTypeStringify(required?: boolean) {
    return required ? ':' : '?:';
}

export function requiredKeyStringify(key: string, required: boolean) {
    return required ? key : `[${key}]`;
}
