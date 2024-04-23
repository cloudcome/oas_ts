import type { OpenApi3 } from '../types/openapi';
import { isRefParameter, type OpenApi3_Parameter, requiredKeyStringify } from './helpers';
import type { Named } from './Named';
import { Schemata } from './Schemata';

export type ArgKind = 'path' | 'headers' | 'cookies' | 'params' | 'data' | 'config' | 'return';
export type ArgItem = {
    kind: ArgKind;
    name: string;
    required: boolean;
    type: string;
    // 是否已经被解构了
    structured: boolean;
    comments: Record<string, unknown>;
};
type InternalArgItem = {
    parameter: OpenApi3.ParameterObject;
    schema: OpenApi3.SchemaObject;
};

export class Arg {
    parameters: OpenApi3_Parameter[] = [];

    constructor(
        private named: Named,
        private kind: ArgKind,
        private schemata: Schemata,
        private isRoot = false,
    ) {}

    add(parameter?: OpenApi3_Parameter) {
        if (!parameter) return;

        this.parameters.push(parameter);
    }

    parse(): ArgItem | null {
        const iternalArgItems: InternalArgItem[] = [];
        const fixedParameters = this.parameters.filter((p) => !isRefParameter(p) && 'schema' in p && p.schema) as OpenApi3.ParameterObject[];
        const propLength = fixedParameters.length;
        const requiredNames: string[] = [];

        fixedParameters.forEach((parameter) => {
            const { required, schema, name } = parameter;

            if (required) requiredNames.push(name);
            iternalArgItems.push({
                parameter,
                schema: schema!,
            });
        });

        switch (propLength) {
            case 0: {
                if (this.kind === 'path') {
                    return {
                        kind: this.kind,
                        name: this.named.nextVarName(this.kind),
                        required: false,
                        structured: false,
                        type: '',
                        comments: {},
                    };
                }

                if (this.kind === 'config') {
                    const name = this.named.nextVarName(this.kind);
                    return {
                        kind: this.kind,
                        name,
                        required: false,
                        structured: false,
                        type: '',
                        comments: {
                            [`param [${name}]`]: 'request config',
                        },
                    };
                }

                return null;
            }

            case 1: {
                // prop0: type0
                const [firstArg] = iternalArgItems;
                const { parameter, schema } = firstArg;
                const result = this.schemata.print(schema);
                const name = this.kind === 'return' ? this.kind : this.named.nextVarName(parameter.name || this.kind);
                const required = parameter.required || result.required || false;

                return {
                    name,
                    kind: this.kind,
                    required,
                    structured: !this.isRoot,
                    type: Schemata.toString(result, true),
                    comments:
                        this.kind === 'return'
                            ? {
                                  returns: parameter.description || schema.description || false,
                              }
                            : {
                                  [`param ${requiredKeyStringify(name, required)}`]: parameter.description || schema.description || 'request param',
                              },
                };
            }

            default: {
                // name: {prop0: type0, prop1: type1, ...}
                const rootSchema: OpenApi3.SchemaObject = {
                    type: 'object',
                    properties: iternalArgItems.reduce(
                        (acc, { parameter, schema }) => {
                            acc[parameter.name] = {
                                ...schema,
                                description: parameter.description || schema.description,
                            };
                            return acc;
                        },
                        {} as Record<string, OpenApi3.SchemaObject>,
                    ),
                    required: requiredNames,
                };
                const result = this.schemata.print(rootSchema);
                const name = this.named.nextVarName(this.kind);
                const required = requiredNames.length > 0;

                return {
                    name,
                    required,
                    kind: this.kind,
                    structured: false,
                    type: Schemata.toString(result),
                    comments:
                        this.kind === 'return'
                            ? {
                                  returns: result.comments.description,
                              }
                            : {
                                  [`param ${requiredKeyStringify(name, required)}`]: 'request params',
                              },
                };
            }
        }
    }
}
