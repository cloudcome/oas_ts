import type { OpenApi3 } from '../types/openapi';
import { never } from '../utils/func';
import { isArray, isBoolean, isNumber, isString } from '../utils/type-is';
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

        const { type, allOf, oneOf, anyOf, default: defaultValue, deprecated, description, format, readOnly, title } = schema;
        const comments = JsDoc.fromSchema(schema);

        if (allOf) {
            return {
                comments,
                type: withGroup(
                    allOf.map((s) => this.toString(s)),
                    '&',
                ),
                required: false,
            };
        }

        if (oneOf) {
            return {
                comments,
                type: withGroup(
                    oneOf.map((s) => this.toString(s)),
                    '|',
                ),
                required: false,
            };
        }

        if (anyOf) {
            return {
                comments,
                type: withGroup(
                    anyOf.map((s) => this.toString(s)),
                    ',',
                    'AnyOf<',
                    '>',
                ),
                required: false,
            };
        }

        if (isArray(type)) {
            return {
                comments,
                type: withGroup(
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
                        ),
                    ),
                    '|',
                ),
                required: false,
            };
        }

        switch (type) {
            case 'string': {
                const { enum: enumValues = [] } = schema;
                return {
                    comments,
                    type:
                        enumValues.length > 0
                            ? withGroup(
                                  enumValues.map((e) => (isString(e) ? JSON.stringify(e) : this.named.getRefType(e.$ref) || 'unknown')),
                                  '|',
                              )
                            : type,
                    required: schema.required || false,
                };
            }

            case 'boolean': {
                const { enum: enumValues = [] } = schema;
                return {
                    comments,
                    type:
                        enumValues.length > 0
                            ? withGroup(
                                  enumValues.map((e) => (isBoolean(e) ? String(e) : this.named.getRefType(e.$ref) || 'unknown')),
                                  '|',
                              )
                            : type,
                    required: schema.required || false,
                };
            }

            case 'number':
            case 'integer': {
                const { enum: enumValues = [] } = schema;
                return {
                    comments,
                    type:
                        enumValues.length > 0
                            ? withGroup(
                                  enumValues.map((e) => (isNumber(e) ? String(e) : this.named.getRefType(e.$ref) || 'unknown')),
                                  '|',
                              )
                            : 'number',
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
        const items = 'items' in schema ? schema.items : null;

        if (!items) {
            return this._printUnknown(schema, 'array');
        }

        const explicit = isArray(items);
        const subSchemas = explicit ? items : [items];
        const subTypes = subSchemas.map((s) => this.toString(s));
        return {
            comments,
            type: explicit ? `[${subTypes.join(',')}]` : `((${subTypes.join('|')})[])`,
            required: false,
        };
    }

    private _printObject(schema: OpenApi3.SchemaBaseObject & OpenApi3.ObjectSubtype) {
        const comments = JsDoc.fromSchema(schema);
        const props = 'properties' in schema ? schema.properties : null;

        if (!props) {
            return this._printUnknown(schema, 'object');
        }

        const entries = Object.entries(props);

        if (entries.length === 0) {
            return this._printUnknown(schema, 'object');
        }

        return {
            comments,
            type: withGroup(
                entries.map(([name, subSchema]) => {
                    const { required: subRequired, comments, type } = this.print(subSchema);
                    const required = schema.required?.includes(name) || subRequired || false;
                    const jsDoc = new JsDoc();
                    jsDoc.addComments(comments);
                    return [jsDoc.print(), `${name}${requiredTypeStringify(required)}${type};`].filter(Boolean).join('\n');
                }),
                '\n',
                '{\n',
                '\n}',
            ),
            required: false,
        };
    }

    private _printUnknown(schema: OpenApi3_Schema, type: 'object' | 'array' | 'primitive' = 'primitive') {
        const comments = JsDoc.fromSchema(schema);

        return {
            comments,
            type: type === 'object' ? 'Record<keyof unknown, unknown>' : type === 'array' ? '(unknown[])' : 'unknown',
            required: false,
        };
    }

    toString(schema: OpenApi3_Schema) {
        const result = this.print(schema);
        return Schemata.toString(result);
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
