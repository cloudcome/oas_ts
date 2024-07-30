import path from 'path';
import { OpenAPIVersion, type OpenAPIV2, type OpenAPIV3 } from '../types/openapi';
import { objectMap } from '../utils/object';
import { isBoolean, isUndefined } from '../utils/type-is';

// https://liqiang.io/post/openapi-30-vs-swagger-20
// https://blog.postman.com/openapi-vs-swagger/

function migRef(
    refObj: {
        $ref: string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [key: string]: any;
    },
    position: keyof OpenAPIV3.ComponentsObject,
) {
    return {
        ...refObj,
        $ref: refObj.$ref.replace(/^#\/[^/]+\//, `#/components/${position}/`),
    };
}

function migSchema(schema: OpenAPIV2.SchemaObject | OpenAPIV2.ReferenceObject): OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject {
    if (isUndefined(schema)) return schema;
    if ('$ref' in schema) return migRef(schema as OpenAPIV3.ReferenceObject, 'schemas');

    // TODO not discriminator 未处理
    const { id, type, format, properties, items, additionalProperties, allOf, oneOf, anyOf, not, discriminator, ...rest } = schema;

    if (allOf || oneOf || anyOf) {
        return {
            ...rest,
            allOf: allOf && allOf.map(migSchema),
            oneOf: oneOf && oneOf.map(migSchema),
            anyOf: anyOf && anyOf.map(migSchema),
        };
    }

    if (type === 'array') {
        return {
            // ...rest,
            type,
            items: migSchema(items || {}),
        };
    }

    const isFile = type === 'file';

    return {
        ...rest,
        type: type === 'file' ? 'string' : type,
        format: isFile ? 'binary' : format,
        properties: properties && objectMap(properties, migSchema),
        additionalProperties: isBoolean(additionalProperties) ? additionalProperties : additionalProperties && migSchema(additionalProperties),
    };
}

function migHeader(header: OpenAPIV2.HeaderObject | OpenAPIV2.ReferenceObject | undefined): OpenAPIV3.HeaderObject | OpenAPIV3.ReferenceObject | undefined {
    if (!header) return header;
    if ('$ref' in header) return migRef(header as OpenAPIV2.ReferenceObject, 'headers');

    const { ...schema } = header;

    return {
        schema: schema && migSchema(schema),
    };
}

function migResponse(
    response: OpenAPIV2.ResponseObject | OpenAPIV2.ReferenceObject | undefined,
    medias: string[],
): OpenAPIV3.ResponseObject | OpenAPIV3.ReferenceObject | undefined {
    if (isUndefined(response)) return response;
    if ('$ref' in response) return migRef(response, 'responses');

    const { description, schema, headers, examples } = response;
    const schemaV3 = schema && migSchema(schema);

    return {
        description,
        headers: headers && objectMap(headers, migHeader),
        content: schemaV3
            ? medias.reduce(
                  (content, media) => {
                      content[media] = {
                          examples,
                          schema: schemaV3,
                      };
                      return content;
                  },
                  {} as NonNullable<OpenAPIV3.ResponseObject['content']>,
              )
            : {},
    };
}

function extractParameterSchema(parameter: OpenAPIV2.Parameter | OpenAPIV2.ReferenceObject): OpenAPIV2.SchemaObject | OpenAPIV2.ReferenceObject {
    if ('$ref' in parameter) return { $ref: parameter.$ref };
    if ('schema' in parameter) return parameter.schema;

    const { in: in_, required, name, description, ...schema } = parameter;
    return schema;
}

// https://swagger.io/docs/specification/2-0/describing-parameters/
// https://swagger.io/docs/specification/serialization/
const collectionFormatMap: Record<string, OpenAPIV3.ParameterBaseObject['style']> = {
    csv: 'form',
    ssv: 'spaceDelimited',
    tsv: 'form',
    pipes: 'pipeDelimited',
    multi: 'form',
};
const explodeMap = {
    csv: false,
    ssv: false,
    tsv: false,
    pipes: false,
    multi: true,
};
function migGeneralParameter(parameter: OpenAPIV2.GeneralParameterObject | OpenAPIV2.ReferenceObject): OpenAPIV3.ParameterObject | OpenAPIV3.ReferenceObject {
    if ('$ref' in parameter) {
        return migRef(parameter as OpenAPIV3.ReferenceObject, 'parameters');
    }

    const { $ref, in: in_, name, required, description, ...schema } = parameter;
    const inQuery = in_ === 'query';
    const style = inQuery ? collectionFormatMap[parameter.collectionFormat || 'csv'] : undefined;
    const explode = inQuery ? explodeMap[parameter.collectionFormat || 'csv'] : undefined;

    return {
        in: in_ as OpenAPIV3.ParameterObject['in'],
        name,
        required,
        description,
        schema: migSchema(extractParameterSchema(parameter)),
        style,
        explode,
    };
}

function makeRequestBody(bodySchema: BodySchema[], medias: string[]): OpenAPIV3.RequestBodyObject {
    let requestBodySchema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject | undefined;
    const bodyRequest = bodySchema.find(({ parameter }) => parameter.in === 'body');
    const requestBodyRest = {};

    if (bodyRequest) {
        requestBodySchema = bodyRequest.schema;
        const { required, description } = bodyRequest.parameter;
        Object.assign(requestBodyRest, { required, description });
    } else if (bodySchema.length > 0) {
        requestBodySchema = {
            type: 'object',
            properties: bodySchema.reduce(
                (properties, { parameter, schema }) => {
                    const { required, default: default_, description } = parameter;
                    properties[parameter.name] = {
                        required,
                        default: default_,
                        description,
                        ...schema,
                    };
                    return properties;
                },
                {} as Record<string, OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject>,
            ),
        };
    }

    return {
        ...requestBodyRest,
        content: requestBodySchema
            ? medias.reduce(
                  (content, media) => {
                      content[media] = { schema: requestBodySchema };
                      return content;
                  },
                  {} as OpenAPIV3.RequestBodyObject['content'],
              )
            : {},
    };
}

const bodyIns = ['body', 'formData'];
type BodySchema = {
    parameter: OpenAPIV2.Parameter;
    schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject;
};
function migOperation(operation: OpenAPIV2.OperationObject): OpenAPIV3.OperationObject {
    const { parameters, responses, consumes, produces, ...rest } = operation;
    const generalParameters: (OpenAPIV3.ParameterObject | OpenAPIV3.ReferenceObject)[] = [];
    const inBodySchemas: BodySchema[] = [];

    parameters?.forEach((parameter) => {
        if ('in' in parameter && bodyIns.includes(parameter.in)) {
            const schema = extractParameterSchema(parameter);
            inBodySchemas.push({
                parameter,
                schema: migSchema(schema),
            });
        } else {
            generalParameters.push(migGeneralParameter(parameter as OpenAPIV2.GeneralParameterObject | OpenAPIV2.ReferenceObject));
        }
    });

    return {
        ...rest,
        parameters: generalParameters.length > 0 ? generalParameters : undefined,
        requestBody: makeRequestBody(inBodySchemas, consumes || ['*']),
        responses: objectMap(responses, (resp) => migResponse(resp, produces || ['*'])),
    };
}

function migPathItem(pathItem: OpenAPIV2.PathItemObject | undefined): OpenAPIV3.PathItemObject | undefined {
    if (isUndefined(pathItem)) return pathItem;

    const { parameters, get, delete: delete_, head, options, patch, post, $ref, put } = pathItem;

    return {
        $ref,
        // 忽略
        // parameters: parameters && parameters.map(migParameter),
        get: get && migOperation(get),
        delete: delete_ && migOperation(delete_),
        head: head && migOperation(head),
        options: options && migOperation(options),
        patch: patch && migOperation(patch),
        post: post && migOperation(post),
        put: put && migOperation(put),
    };
}

function migServers(host: string | undefined, basePath: string | undefined, schemes: string[] | undefined): OpenAPIV3.ServerObject[] | undefined {
    if (schemes?.length && host) {
        return schemes.map((scheme) => ({
            url: scheme.replace(/:.*$/, '') + '://' + path.join(host, basePath || '/'),
        }));
    } else if (host || basePath) {
        return [
            {
                url: path.join(host || '', basePath || '/'),
            },
        ];
    }
}

export function migrate_2_0To3_0(v2: OpenAPIV2.Document): OpenAPIV3.Document {
    const { info, paths, definitions, swagger, tags, parameters, responses, externalDocs, host, basePath, schemes } = v2;

    return {
        openapi: OpenAPIVersion.V3_0,
        info,
        tags,
        externalDocs,
        paths: objectMap(paths, migPathItem),
        components: {
            schemas: definitions && objectMap(definitions, migSchema),
            parameters: parameters && objectMap(parameters, migGeneralParameter),
            responses: responses && objectMap(responses, (resp) => migResponse(resp, ['*'])),
        },
        servers: migServers(host, basePath, schemes),
    };
}
