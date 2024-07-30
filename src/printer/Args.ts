import type { ArgParsed as FixedArg } from './Arg';
import { requiredTypeStringify } from './helpers';

export class Args {
    fixedArgs: FixedArg[];
    constructor(private args: (FixedArg | null)[]) {
        this.fixedArgs = this._sort();
    }

    private _sort() {
        const fixedArgs = this.args.filter(Boolean) as FixedArg[];
        return fixedArgs.sort((a, b) => Number(b.required) - Number(a.required));
    }

    toComments() {
        return this.fixedArgs.reduce(
            (acc, arg) => {
                return {
                    ...acc,
                    ...arg.comments,
                };
            },
            {} as Record<string, unknown>,
        );
    }

    toArgs(configTypeName: string) {
        return this.fixedArgs
            .filter((fixArg) => fixArg.arg.kind !== 'path' || fixArg.type !== '')
            .map((fixArg) => {
                return `${fixArg.uniqueName}${requiredTypeStringify(fixArg.required)}${fixArg.type || configTypeName}`;
            })
            .join(',');
    }

    toType(index: number) {
        return this.fixedArgs[index]?.type || 'unknown';
    }

    toValues(url: string) {
        return this.fixedArgs
            .map((fixedArg) => {
                const { originName, uniqueName, arg, props } = fixedArg;

                if (arg.kind === 'config') return `...${uniqueName}`;

                if (arg.kind === 'path') {
                    const resolvedURL = url.replace(/\{(.*?)}/g, (_, name) => {
                        if (!props.includes(name)) {
                            throw new Error(`路径参数 ${name} 不存在`);
                        }

                        // 只有一个路径参数时，路径值直接传入
                        if (props.length === 1) return `\${${uniqueName}}`;

                        return `\${${uniqueName}['${name}']}`;
                    });
                    return `url: \`${resolvedURL}\``;
                }

                const value = props.length === 1 && !arg.isSingle ? `{${originName}: ${uniqueName}}` : uniqueName;
                return `${arg.kind}: ${value}`;
            })
            .join(',\n');
    }
}
