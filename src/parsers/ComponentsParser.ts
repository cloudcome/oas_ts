import { OpenAPIV3 } from 'openapi-types';
import { isBoolean } from '../utils/type-is';
import { BaseParser } from './BaseParser';
import type { TypeAlias, TypeItem, TypeList, TypeOrigin, TypeUnit } from './types';

export class ComponentsParser extends BaseParser {
    parseComponents(): TypeList {
        const { components } = this.document;

        if (!components) return [];

        const { schemas } = components;

        if (!schemas) return [];

        const t = Object.entries(schemas)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([name, schema]) => {
                const typeName = this.named.nextTypeName(name, true);
                return this.isReference(schema)
                    ? this.parseReference(typeName, true, schema, true)
                    : this.parseSchema(typeName, schema.nullable === false, schema);
            });
        this.named.resolveAlias();
        return t;
    }

    protected parseReference(name: string, required: boolean, reference: OpenAPIV3.ReferenceObject, refAble = false): TypeAlias {
        return this.named.addAlias({
            kind: 'alias',
            refAble,
            name,
            required,
            ref: reference.$ref,
            target: '',
            origin: '',
            props: [],
        });
    }

    protected parseSchema(name: string, required: boolean, schema: OpenAPIV3.SchemaObject) {
        const { type } = schema;

        switch (type) {
            case 'boolean':
            case 'string':
            case 'number':
            case 'integer': {
                const tsType = type === 'integer' ? 'number' : type;
                return this.parseSchemaPrimitive(name, required, tsType, schema);
            }

            case 'object':
                return this.parseSchemaObject(name, required, schema);

            case 'array':
                return this.parseSchemaArray(name, required, schema);

            default:
                return this.parseSchemaNever(name, true, schema);
        }
    }

    protected parseSchemaPrimitive(name: string, required: boolean, type: TypeUnit, schema: OpenAPIV3.SchemaObject): TypeOrigin {
        return {
            ...this.inheritProps(schema),
            name,
            type,
            // {type: 'string', required: true}
            required: (schema.required as boolean | undefined) || required,
            kind: 'origin',
        };
    }

    protected parseSchemaObject(name: string, required: boolean, schema: OpenAPIV3.SchemaObject): TypeOrigin {
        const properties = Object.entries(schema.properties || {}).sort((a, b) => a[0].localeCompare(b[0]));
        const children = properties.map(([propName, propSchema]) => {
            const required = schema.required?.includes(propName) || false;
            return this.isReference(propSchema) ? this.parseReference(propName, required, propSchema) : this.parseSchema(propName, required, propSchema);
        });

        const additional = this.parseObjectAdditionalProperties(schema.additionalProperties);
        if (additional) children.push(additional);

        return {
            ...this.inheritProps(schema),
            name,
            required,
            kind: 'origin',
            type: 'object',
            children,
        };
    }

    protected parseSchemaArray(name: string, required: boolean, schema: OpenAPIV3.ArraySchemaObject): TypeOrigin {
        const children = [schema.items].map((schema) => {
            return this.isReference(schema) ? this.parseReference(`${name}[]`, true, schema) : this.parseSchema(`${name}[]`, schema.nullable === false, schema);
        });

        const additional = this.parseObjectAdditionalProperties(schema.additionalProperties);
        if (additional) children.push(additional);

        return {
            ...this.inheritProps(schema),
            name,
            required,
            kind: 'origin',
            type: 'array',
            children: children,
        };
    }

    protected parseObjectAdditionalProperties(additionalProperties: OpenAPIV3.SchemaObject['additionalProperties']): TypeItem | undefined {
        if (!additionalProperties) return;

        const name = '[key: string]';

        if (isBoolean(additionalProperties)) {
            if (additionalProperties) {
                return {
                    kind: 'origin',
                    type: 'any',
                    name,
                    required: true,
                };
            }
            return;
        }

        return this.isReference(additionalProperties)
            ? this.parseReference(name, true, additionalProperties)
            : this.parseSchema(name, true, additionalProperties);
    }

    protected parseSchemaNever(name: string, required: boolean, schema: OpenAPIV3.SchemaObject): TypeOrigin {
        return {
            ...this.inheritProps(schema),
            name,
            required,
            kind: 'origin',
            type: 'never',
        };
    }

    private inheritProps(schema: OpenAPIV3.BaseSchemaObject) {
        return {
            default: schema.default,
            description: schema.description,
            example: schema.example,
            deprecated: schema.deprecated,
            title: schema.title,
            format: schema.format,
            enum: schema.enum,
        };
    }
}
