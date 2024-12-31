import { type OpenAPIV3, type OpenAPIV3_1, OpenAPIVersion } from '../types/openapi';
import { objectMap } from '../utils/object';
import { isBoolean, isUndefined } from '../utils/type-is';

// https://www.openapis.org/blog/2021/02/16/migrating-from-openapi-3-0-to-3-1-0
// https://www.apimatic.io/blog/2021/09/migrating-to-and-from-openapi-3-1

function migSchema(schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject): OpenAPIV3_1.SchemaObject | OpenAPIV3_1.ReferenceObject {
  if (isUndefined(schema))
    return schema;

  if ('$ref' in schema) {
    if (schema.nullable) {
      return {
        oneOf: [{ $ref: schema.$ref }, { type: 'null' }],
      };
    }

    return schema;
  }

  const { type, nullable, properties, additionalProperties, allOf, oneOf, anyOf, ...rest } = schema;

  if (allOf || oneOf || anyOf) {
    const schemaOf = {
      ...rest,
      allOf: allOf && allOf.map(migSchema),
      oneOf: oneOf && oneOf.map(migSchema),
      anyOf: anyOf && anyOf.map(migSchema),
    };

    if (nullable) {
      return {
        oneOf: [schemaOf, { type: 'null' }],
      };
    }

    return schemaOf;
  }

  if (type === 'array') {
    return {
      ...rest,
      type: nullable ? [type, 'null'] : [type],
      items: migSchema(schema.items),
    };
  }

  if (isUndefined(type)) {
    return {
      ...rest,
      type: nullable ? ['null'] : [],
    };
  }

  return {
    ...rest,
    type: nullable ? [type, 'null'] : [type],
    properties: properties && objectMap(properties, migSchema),
    additionalProperties: isBoolean(additionalProperties) ? additionalProperties : additionalProperties && migSchema(additionalProperties),
  };
}

function migOperation(operation: OpenAPIV3.OperationObject): OpenAPIV3_1.OperationObject {
  // TODO callbacks、severs 未处理
  const { parameters, requestBody, responses, callbacks, servers, ...rest } = operation;

  return {
    ...rest,
    parameters: parameters?.map(migParameter),
    requestBody: requestBody && migRequest(requestBody),
    responses: objectMap(responses, migResponse),
  };
}

function migPathItem(pathItem: OpenAPIV3.PathItemObject | undefined): OpenAPIV3_1.PathItemObject | OpenAPIV3_1.ReferenceObject | undefined {
  if (!pathItem)
    return pathItem;

  // TODO parameters、reset 未处理
  const { parameters, get, post, delete: delete_, description, head, $ref, options, patch, put, trace, ...rest } = pathItem;

  if ($ref) {
    return {
      description,
      $ref,
    };
  }

  return {
    // ...rest,
    // 忽略
    // parameters: parameters && parameters.map(migParameter),
    description,
    get: get && migOperation(get),
    post: post && migOperation(post),
    delete: delete_ && migOperation(delete_),
    head: head && migOperation(head),
    options: options && migOperation(options),
    patch: patch && migOperation(patch),
    put: put && migOperation(put),
    trace: trace && migOperation(trace),
  };
}

function migRequest(req: OpenAPIV3.RequestBodyObject | OpenAPIV3.ReferenceObject): OpenAPIV3_1.RequestBodyObject | OpenAPIV3_1.ReferenceObject {
  if ('$ref' in req)
    return req;

  const { content, ...rest } = req;

  return {
    ...rest,
    content: objectMap(content, content => ({
      ...content,
      schema: content.schema && migSchema(content.schema),
    })),
  };
}

function migResponse(
  response: OpenAPIV3.ResponseObject | OpenAPIV3.ReferenceObject | undefined,
): OpenAPIV3_1.ResponseObject | OpenAPIV3_1.ReferenceObject | undefined {
  if (isUndefined(response))
    return response;
  if ('$ref' in response)
    return response;

  const { content, description, headers } = response;

  if (isUndefined(content)) {
    return {
      description,
      headers: headers && objectMap(headers, migHeader),
    };
  }

  return {
    description,
    headers: headers && objectMap(headers, migHeader),
    content: objectMap(content, value => ({
      ...value,
      schema: value.schema && migSchema(value.schema),
    })),
  };
}

function migParameter(param: OpenAPIV3.ParameterObject | OpenAPIV3.ReferenceObject): OpenAPIV3_1.ParameterObject | OpenAPIV3_1.ReferenceObject {
  if ('$ref' in param)
    return param;

  const { schema, ...rest } = param;

  return {
    ...rest,
    schema: schema && migSchema(schema),
  };
}

function migHeader(header: OpenAPIV3.HeaderObject | OpenAPIV3.ReferenceObject | undefined): OpenAPIV3_1.HeaderObject | OpenAPIV3_1.ReferenceObject | undefined {
  if (!header)
    return header;
  if ('$ref' in header)
    return header;

  const { schema, ...rest } = header;

  return {
    ...rest,
    schema: schema && migSchema(schema),
  };
}

function migComponents(v3: OpenAPIV3.ComponentsObject): OpenAPIV3_1.ComponentsObject {
  const { schemas = {}, requestBodies = {}, responses = {}, parameters = {}, headers = {} } = v3;

  return {
    schemas: objectMap(schemas, migSchema),
    requestBodies: objectMap(requestBodies, migRequest),
    responses: objectMap(responses, migResponse),
    parameters: objectMap(parameters, migParameter),
    headers: objectMap(headers, migHeader),
  };
}

export function migrate_3_0To3_1(v3_0: OpenAPIV3.Document): OpenAPIV3_1.Document {
  const { info, tags, paths, components, servers, security } = v3_0;

  // TODO servers、security 未处理
  return {
    openapi: OpenAPIVersion.V3_1,
    info,
    tags,
    paths: objectMap(paths, migPathItem),
    components: components && migComponents(components),
  };
}
