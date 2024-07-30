import type { OpenAPILatest } from '../types/openapi';
import { isString } from '../utils/type-is';

export type OpenApiLatest_Schema = OpenAPILatest.SchemaObject | OpenAPILatest.ReferenceObject;

export function isRefSchema(schema: OpenApiLatest_Schema): schema is OpenAPILatest.ReferenceObject {
    return '$ref' in schema && isString(schema.$ref);
}

export type OpenApiLatest_Parameter = OpenAPILatest.ReferenceObject | OpenAPILatest.ParameterObject;

export function isRefParameter(parameter: OpenApiLatest_Parameter): parameter is OpenAPILatest.ReferenceObject {
    return '$ref' in parameter && isString(parameter.$ref);
}

export type OpenApiLatest_Request = OpenAPILatest.ReferenceObject | OpenAPILatest.RequestBodyObject;

export function isRefRequest(request: OpenApiLatest_Request): request is OpenAPILatest.ReferenceObject {
    return '$ref' in request && isString(request.$ref);
}

export type OpenApiLatest_Media = OpenAPILatest.ReferenceObject | OpenAPILatest.MediaTypeObject;

export function isRefMedia(request: OpenApiLatest_Media): request is OpenAPILatest.ReferenceObject {
    return '$ref' in request && isString(request.$ref);
}

export type OpenApiLatest_PathItem = OpenAPILatest.PathItemObject | OpenAPILatest.ReferenceObject;

export function isRefPathItem(pathItem: OpenApiLatest_PathItem): pathItem is OpenAPILatest.ReferenceObject {
    return '$ref' in pathItem && isString(pathItem.$ref);
}

export type OpenApiLatest_Operation = OpenAPILatest.OperationObject | OpenAPILatest.ReferenceObject;

export function isRefOperation(operation: OpenApiLatest_Operation): operation is OpenAPILatest.ReferenceObject {
    return '$ref' in operation && isString(operation.$ref);
}

export type OpenApiLatest_Response = OpenAPILatest.ResponseObject | OpenAPILatest.ReferenceObject;

export function isRefResponse(response: OpenApiLatest_Response): response is OpenAPILatest.ReferenceObject {
    return '$ref' in response && isString(response.$ref);
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
