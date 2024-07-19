import type { ArgItem } from './Arg';
import { requiredTypeStringify } from './helpers';
import { Named } from './Named';

export class Args {
    fixedArgs: ArgItem[];
    constructor(private args: (ArgItem | null)[]) {
        this.fixedArgs = this._sort();
    }

    private _sort() {
        const fixedArgs = this.args.filter(Boolean) as ArgItem[];
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
            .filter((arg) => arg.kind !== 'path' || arg.type !== '')
            .map((arg) => {
                return `${arg.uniqueName}${requiredTypeStringify(arg.required)}${arg.type || configTypeName}`;
            })
            .join(',');
    }

    toType(index: number) {
        return this.fixedArgs[index]?.type || 'unknown';
    }

    toValues(url: string) {
        return this.fixedArgs
            .map((arg) => {
                const { kind, originName, uniqueName, type } = arg;

                if (kind === 'config') return `...${uniqueName}`;

                const propVal = arg.structured ? `{${originName}:${uniqueName}}` : uniqueName;

                if (kind === 'path') {
                    const args = [
                        //
                        'BASE_URL',
                        JSON.stringify(url),
                    ];

                    if (type !== '') args.push(propVal);

                    return `url:resolveURL(${args.join(',')})`;
                }

                return `${originName}:${propVal}`;
            })
            .join(',\n');
    }
}
