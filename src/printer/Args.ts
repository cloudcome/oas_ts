import type { Arg } from './Arg';
import { requiredTypeStringify } from './helpers';

export class Args {
  fixedArgs: Arg[];
  constructor(private args: (Arg | null)[]) {
    this.fixedArgs = this._sort();
  }

  private _sort() {
    const fixedArgs = this.args.filter(Boolean) as Arg[];
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

  toArgs() {
    return this.fixedArgs
      .filter(fixArg => fixArg.type !== '')
      .map((fixArg) => {
        return `${fixArg.varName}${requiredTypeStringify(fixArg.required)}${fixArg.type}`;
      })
      .join(',');
  }

  toType(index: number) {
    return this.fixedArgs[index]?.type || 'unknown';
  }

  toValues() {
    return this.fixedArgs
      .map((fixedArg) => {
        const { originName, varName, propName, kind, props, url, isSingle } = fixedArg;

        switch (kind) {
          case 'config':
            return `...${varName}`;

          case 'path': {
            const pathNameInProps = props.reduce((acc, cur) => {
              acc[cur.name] = true;
              return acc;
            }, {} as Record<string, boolean>);
            const resolvedURL = url.replace(/\{(.*?)\}/g, (_, originName) => {
              const propPrintName = pathNameInProps[originName];

              if (!propPrintName) {
                throw new Error(`路径参数 ${originName} 未定义`);
              }

              // 只有一个路径参数时，路径值直接传入
              if (props.length === 1)
                return `\${${varName}}`;

              return `\${${varName}[${JSON.stringify(propPrintName)}]}`;
            });
            return `url: \`${resolvedURL}\``;
          }

          default: {
            const value = props.length === 1 && !isSingle ? `{${JSON.stringify(originName)}: ${varName}}` : varName;
            return `${propName}: ${value}`;
          }
        }
      })
      .join(',\n');
  }
}
