import type { OpenApi3 } from '../types/openapi';
import { never } from '../utils/func';
import { isArray, isBoolean, isNumber, isString, isUndefined } from '../utils/type-is';
import { isRefSchema, type OpenApi3_Schema, requiredTypeStringify } from './helpers';
import { JsDoc } from './JsDoc';
import type { Named } from './Named';

type SchemaResult = {
    comments: Record<string, unknown>;
    type: string;
    required: boolean;
};

function withGroup(texts: string[], separator: string, start = '(', end = ')') {
    return start + texts.join(separator) + end;
}

function withNullable(type: string, nullable?: boolean) {
    return nullable ? `(${type}) | null` : type;
}

export class Schemata {
    constructor(private named: Named) {}

    print(schema: OpenApi3_Schema): SchemaResult {
        if (isRefSchema(schema)) {
            return {
                comments: JsDoc.fromRef(schema),
                type: this.named.getRefType(schema.$ref) || 'unknown',
                required: false,
            };
        }

        const { type, allOf, oneOf, anyOf, nullable } = schema;
        const comments = JsDoc.fromSchema(schema);

        if (allOf) {
            return {
                comments,
                type: withNullable(
                    withGroup(
                        allOf.map((s) => this.toString(s)),
                        '&',
                    ),
                    nullable,
                ),
                required: false,
            };
        }

        if (oneOf) {
            return {
                comments,
                type: withNullable(
                    withGroup(
                        oneOf.map((s) => this.toString(s)),
                        '|',
                    ),
                    nullable,
                ),
                required: false,
            };
        }

        if (anyOf) {
            return {
                comments,
                type: withNullable(
                    withGroup(
                        anyOf.map((s) => this.toString(s)),
                        ',',
                        'AnyOf<',
                        '>',
                    ),
                    nullable,
                ),
                required: false,
            };
        }

        if (isArray(type)) {
            return {
                comments,
                type: withNullable(
                    withGroup(
                        type.map((type) =>
                            this.toString(
                                type === 'null'
                                    ? { type }
                                    : ({
                                          // 将枚举值传给子类型
                                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                          // @ts-ignore
                                          enum: schema.enum,
                                          type,
                                      } as OpenApi3.SchemaObject),
                                true,
                            ),
                        ),
                        '|',
                    ),
                    nullable,
                ),
                required: false,
            };
        }

        switch (type) {
            case 'string': {
                const { enum: enumValues = [] } = schema;
                return {
                    comments,
                    type: withNullable(
                        enumValues.length > 0
                            ? withGroup(
                                  enumValues.map((e) => (isString(e) ? JSON.stringify(e) : this.named.getRefType(e.$ref) || 'unknown')),
                                  '|',
                              )
                            : type,
                        nullable,
                    ),
                    required: schema.required || false,
                };
            }

            case 'boolean': {
                const { enum: enumValues = [] } = schema;
                return {
                    comments,
                    type: withNullable(
                        enumValues.length > 0
                            ? withGroup(
                                  enumValues.map((e) => (isBoolean(e) ? String(e) : this.named.getRefType(e.$ref) || 'unknown')),
                                  '|',
                              )
                            : type,
                        nullable,
                    ),
                    required: schema.required || false,
                };
            }

            case 'number':
            case 'integer': {
                const { enum: enumValues = [] } = schema;
                return {
                    comments,
                    type: withNullable(
                        enumValues.length > 0
                            ? withGroup(
                                  enumValues.map((e) => (isNumber(e) ? String(e) : this.named.getRefType(e.$ref) || 'unknown')),
                                  '|',
                              )
                            : 'number',
                        nullable,
                    ),
                    required: schema.required || false,
                };
            }

            case 'null':
                return {
                    comments,
                    type,
                    required: schema.required || false,
                };

            case 'array':
                return this._printArray(schema);

            case 'object':
                return this._printObject(schema);

            case undefined: {
                // 智能判断类型
                if ('properties' in schema) {
                    return this._printObject(schema);
                } else if ('additionalProperties' in schema) {
                    return this._printObject(schema);
                } else if ('items' in schema) {
                    return this._printArray(schema);
                } else {
                    return this._printUnknown(schema);
                }
            }

            default:
                never(type);
                return this._printUnknown(schema);
        }
    }

    private _printArray(schema: OpenApi3.SchemaBaseObject & OpenApi3.ArraySubtype) {
        const comments = JsDoc.fromSchema(schema);
        const items = 'items' in schema ? schema.items : undefined;

        if (!items) {
            return this._printUnknown(schema, 'array');
        }

        const explicit = isArray(items);
        const subSchemas = explicit ? items : [items];
        const subTypes = subSchemas.map((s) => this.toString(s));
        return {
            comments,
            type: withNullable(explicit ? `[${subTypes.join(',')}]` : `((${subTypes.join('|')})[])`, schema.nullable),
            required: false,
        };
    }

    private _printAddPropBoolean(bool: boolean) {
        return {
            comments: {},
            type: bool ? 'any' : 'never',
            required: true,
        };
    }

    private _printObjectProp(name: string, propSchema: boolean | OpenApi3.SchemaObject | OpenApi3.ReferenceObject, propRequired1: boolean) {
        const { required: propRequired2, comments, type } = isBoolean(propSchema) ? this._printAddPropBoolean(propSchema) : this.print(propSchema);
        const jsDoc = new JsDoc();
        jsDoc.addComments(comments);
        return [jsDoc.print(), `${name}${requiredTypeStringify(propRequired1 || propRequired2 || false)}${type};`].filter(Boolean).join('\n');
    }

    private _printObject(schema: OpenApi3.SchemaBaseObject & OpenApi3.ObjectSubtype) {
        const comments = JsDoc.fromSchema(schema);
        const explicitProps = 'properties' in schema ? schema.properties : undefined;
        // additionalProperties: true
        // additionalProperties: false
        // additionalProperties: {...}
        const genericProps = 'additionalProperties' in schema ? schema.additionalProperties : undefined;
        const explicitEntries = Object.entries(explicitProps || {});

        const explicitTypes = explicitEntries.map(([name, propSchema]) => {
            return this._printObjectProp(JSON.stringify(name), propSchema, isArray(schema.required) ? schema.required?.includes(name) : false);
        });
        const genericTypes = isUndefined(genericProps) ? [] : [this._printObjectProp('[key: string]', genericProps, true)];
        const objectTypes = [...explicitTypes, ...genericTypes];

        if (objectTypes.length === 0) {
            return this._printUnknown(schema, 'object', isBoolean(schema.required) ? schema.required : false);
        }

        return {
            comments,
            type: withNullable(withGroup(objectTypes, '\n', '{\n', '\n}'), schema.nullable),
            required: isBoolean(schema.required) ? schema.required : false,
        };
    }

    private _printUnknown(schema: OpenApi3.SchemaBaseObject & OpenApi3_Schema, type: 'object' | 'array' | 'primitive' = 'primitive', required?: boolean) {
        const comments = JsDoc.fromSchema(schema);

        return {
            comments,
            type: withNullable(
                //
                type === 'object' ? 'AnyObject' : type === 'array' ? 'AnyArray' : 'unknown',
                schema.nullable,
            ),
            required: isBoolean(required) ? required : type === 'primitive',
        };
    }

    toString(schema: OpenApi3_Schema, ignoreComments = false) {
        const result = this.print(schema);
        return Schemata.toString(result, ignoreComments);
    }

    static toString(result: SchemaResult, ignoreComments = false) {
        const { comments, type } = result;

        if (ignoreComments) return type;

        const jsDoc = new JsDoc();
        jsDoc.addComments(comments);
        const header = jsDoc.print();

        return header ? `\n${header}\n${type}\n` : type;
    }
}
