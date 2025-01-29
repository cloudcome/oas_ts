import type { OpenAPILatest } from '../types/openapi';
import type { OpenApiLatest_Schema } from './helpers';
import type { Named } from './Named';
import { never } from '../utils/func';
import { isArray, isBoolean, isNumber, isString, isUndefined } from '../utils/type-is';
import { isRefSchema, requiredTypeStringify } from './helpers';
import { JsDoc } from './JsDoc';

interface SchemaResult {
  comments: Record<string, unknown>;
  type: string;
  required: boolean;
}

function withGroup(texts: string[], separator: string, start = '(', end = ')') {
  return start + texts.join(separator) + end;
}

export class Schemata {
  constructor(private named: Named) {}

  print(schema: OpenApiLatest_Schema): SchemaResult {
    if (isRefSchema(schema)) {
      return {
        comments: JsDoc.fromRef(schema),
        type: this.named.getRefType(schema.$ref) || 'unknown',
        required: false,
      };
    }

    const { type, allOf, oneOf, anyOf, required } = schema;
    const requiredBool = isBoolean(required) ? required : false;
    const comments = JsDoc.fromSchema(schema);

    if (allOf && allOf.length > 0) {
      return {
        comments,
        type: withGroup(
          allOf.map(s => this.toString(s)),
          '&',
        ),
        required: false,
      };
    }

    if (oneOf && oneOf.length > 0) {
      return {
        comments,
        type: withGroup(
          oneOf.map(s => this.toString(s)),
          '|',
        ),
        required: false,
      };
    }

    if (anyOf && anyOf.length > 0) {
      return {
        comments,
        type: withGroup(
          anyOf.map(s => this.toString(s)),
          ',',
          'AnyOf<[',
          ']>',
        ),
        required: false,
      };
    }

    if (isArray(type)) {
      if (type.length === 0) {
        return this._printUnknown(schema, requiredBool);
      }

      if (type.length === 1) {
        return this.print({
          ...schema,
          // eslint-disable-next-line ts/ban-ts-comment
          // @ts-ignore
          type: type[0],
        });
      }

      return {
        comments,
        type: withGroup(
          type.map((type) => {
            const typeStr = this.toString(
              type === 'null'
                // null
                ? { type }
                // origin
                : ({ ...schema, type } as OpenAPILatest.SchemaObject),
              true,
            );
            return `(${typeStr})`;
          }),
          '|',
        ),
        required: false,
      };
    }

    switch (type) {
      case 'string': {
        const { enum: enumValues = [], format, minLength, maxLength, pattern } = schema;
        const isBlob = format === 'binary';
        return {
          comments: {
            ...comments,
            minLength,
            maxLength,
            pattern,
          },
          type:
              enumValues.length > 0
                ? withGroup(
                    enumValues.map(e => (isString(e) ? JSON.stringify(e) : this.named.getRefType(e.$ref) || 'unknown')),
                    '|',
                  )
                : isBlob
                  ? 'Blob'
                  : 'string',
          required: Boolean(schema.required),
        };
      }

      case 'boolean': {
        const { enum: enumValues = [] } = schema;
        return {
          comments,
          type:
              enumValues.length > 0
                ? withGroup(
                    enumValues.map(e => (isBoolean(e) ? String(e) : this.named.getRefType(e.$ref) || 'unknown')),
                    '|',
                  )
                : type,
          required: Boolean(schema.required),
        };
      }

      case 'number':
      case 'integer': {
        const { enum: enumValues = [], const: const_, minimum, maximum } = schema;

        if (!isUndefined(const_))
          enumValues.push(const_);

        return {
          comments: {
            ...comments,
            minimum,
            maximum,
          },
          type:
              enumValues.length > 0
                ? withGroup(
                    enumValues.map(e => (isNumber(e) ? String(e) : this.named.getRefType(e.$ref) || 'unknown')),
                    '|',
                  )
                : 'number',
          required: Boolean(schema.required),
        };
      }

      case 'null':
        return {
          comments,
          type,
          required: Boolean(schema.required),
        };

      case 'array':
        return this._printArray(schema);

      case 'object':
        return this._printObject(schema);

      case undefined: {
        // 智能判断类型
        if ('properties' in schema) {
          return this._printObject(schema);
        }
        else if ('additionalProperties' in schema) {
          return this._printObject(schema);
        }
        else if ('items' in schema) {
          return this._printArray(schema as unknown as OpenAPILatest.ArraySchemaObject);
        }
        else {
          return this._printUnknown(schema, requiredBool);
        }
      }

      default:
        never(type);
        return this._printUnknown(schema, requiredBool);
    }
  }

  private _printArray(schema: OpenAPILatest.ArraySchemaObject) {
    const comments = JsDoc.fromSchema(schema);
    const { minItems, maxItems, items } = schema;

    return {
      comments: {
        ...comments,
        minItems,
        maxItems,
      },
      type: `Array<${this.toString(items)}>`,
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

  private _printObjectProp(name: string, propSchema: boolean | OpenAPILatest.SchemaObject | OpenAPILatest.ReferenceObject, propRequired1: boolean) {
    const { required: propRequired2, comments, type } = isBoolean(propSchema) ? this._printAddPropBoolean(propSchema) : this.print(propSchema);
    const jsDoc = new JsDoc();
    jsDoc.addComments(comments);
    return [jsDoc.print(), `${name}${requiredTypeStringify(propRequired1 || propRequired2 || false)}${type};`].filter(Boolean).join('\n');
  }

  private _printObject(schema: OpenAPILatest.SchemaObject) {
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
    const genericTypes
            = isUndefined(genericProps) || genericProps === false || Object.keys(genericProps).length === 0
              ? []
              : [this._printObjectProp('[key: string]', genericProps, true)];
    const objectTypes = [...explicitTypes, ...genericTypes];

    if (objectTypes.length === 0) {
      return this._printUnknown(schema, isBoolean(schema.required) ? schema.required : false, genericProps === false ? '{}' : 'UnknownObject');
    }

    return {
      comments,
      type: withGroup(objectTypes, '\n', '{\n', '\n}'),
      required: isBoolean(schema.required) ? schema.required : false,
    };
  }

  private _printUnknown(schema: OpenApiLatest_Schema, required = false, type = 'unknown') {
    const comments = JsDoc.fromSchema(schema);

    return {
      comments,
      type,
      required,
    };
  }

  toString(schema: OpenApiLatest_Schema, ignoreComments = false) {
    const result = this.print(schema);
    return Schemata.toString(result, ignoreComments);
  }

  static toString(result: SchemaResult, ignoreComments = false) {
    const { comments, type } = result;

    if (ignoreComments)
      return type;

    const jsDoc = new JsDoc();
    jsDoc.addComments(comments);
    const header = jsDoc.print();

    return header ? `\n${header}\n${type}\n` : type;
  }
}
