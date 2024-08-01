import type { OpenAPILatest } from '../types/openapi';
import { isRefParameter, type OpenApiLatest_Parameter, requiredKeyStringify } from './helpers';
import type { Named } from './Named';
import { Schemata } from './Schemata';

export type ArgKind = 'path' | 'headers' | 'cookies' | 'params' | 'data' | 'config' | 'response';
export type ArgParsed = {
    arg: Arg;
    originName: string;
    uniqueName: string;
    required: boolean;
    type: string;
    comments: Record<string, unknown>;
    props: string[];
};
type InternalArgItem = {
    parameter: OpenAPILatest.ParameterObject;
    schema: OpenAPILatest.SchemaObject;
};

export class Arg {
    parameters: OpenApiLatest_Parameter[] = [];

    constructor(
        readonly named: Named,
        readonly kind: ArgKind,
        readonly schemata: Schemata,
        /**
         * 是否单参数（如 data、config、response）
         */
        readonly isSingle: boolean = false,
    ) {}

    add(parameter?: OpenApiLatest_Parameter) {
        if (!parameter) return;

        this.parameters.push(parameter);
    }

    parse(): ArgParsed | null {
        const internalArgItems: InternalArgItem[] = [];
        const fixedParameters = this.parameters.filter((p) => !isRefParameter(p) && 'schema' in p && p.schema) as OpenAPILatest.ParameterObject[];
        const propLength = fixedParameters.length;
        const props = fixedParameters.map((p) => p.name);
        const requiredNames: string[] = [];

        fixedParameters.forEach((parameter) => {
            const { required, schema, name } = parameter;

            if (!schema) return;

            if (required || parameter.in === 'path') {
                requiredNames.push(name);
                parameter.required = true;
            }

            internalArgItems.push({
                parameter,
                // NO ERROR PLEASE
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                schema: schema!,
            });
        });

        switch (propLength) {
            case 0: {
                if (this.kind === 'path') {
                    return {
                        arg: this,
                        originName: this.kind,
                        uniqueName: this.named.nextVarName(this.kind),
                        // 路径参数必填
                        required: true,
                        type: '',
                        comments: {},
                        props,
                    };
                }

                if (this.kind === 'config') {
                    const name = this.named.nextVarName(this.kind);
                    return {
                        arg: this,
                        originName: this.kind,
                        uniqueName: name,
                        required: false,
                        type: '',
                        comments: {
                            [`param [${name}]`]: 'request config',
                        },
                        props,
                    };
                }

                return null;
            }

            case 1: {
                // prop0: type0
                const [firstArg] = internalArgItems;
                const { parameter, schema } = firstArg;
                const result = this.schemata.print(schema);
                const name = this.kind === 'response' ? this.kind : this.named.nextVarName(parameter.name || this.kind);
                const required = parameter.required || result.required || false;

                return {
                    arg: this,
                    originName: parameter.name,
                    uniqueName: name,
                    required: required,
                    type: Schemata.toString(result, true),
                    props,
                    comments:
                        this.kind === 'response'
                            ? {
                                  returns: parameter.description || schema.description || false,
                              }
                            : {
                                  [`param ${requiredKeyStringify(name, required)}`]:
                                      parameter.description || schema.description || `request ${this.kind === 'data' ? 'data' : 'param'}`,
                              },
                };
            }

            default: {
                // name: {prop0: type0, prop1: type1, ...}
                const rootSchema: OpenAPILatest.SchemaObject = {
                    type: 'object',
                    properties: internalArgItems.reduce(
                        (acc, { parameter, schema }) => {
                            acc[parameter.name] = {
                                ...schema,
                                description: parameter.description || schema.description,
                                deprecated: parameter.deprecated || schema.deprecated,
                            };
                            return acc;
                        },
                        {} as Record<string, OpenAPILatest.SchemaObject>,
                    ),
                    required: requiredNames,
                };
                const result = this.schemata.print(rootSchema);
                const name = this.named.nextVarName(this.kind);
                const required = requiredNames.length > 0;

                return {
                    arg: this,
                    originName: this.kind,
                    uniqueName: name,
                    required,
                    type: Schemata.toString(result),
                    props,
                    comments:
                        this.kind === 'response'
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
