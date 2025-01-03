import type { Options } from 'prettier';
import path from 'node:path';
import process from 'node:process';

export function fixVarName(origin: string, bigger = false, fallback = 'var') {
  const name
        = origin
          .replace(/\W/g, '_')
          .replace(/(^_+|_+$)/g, '')
          .replace(/_(.)/g, ($0, $1: string) => $1.toUpperCase())
          .replace(/^\d+/, '') || fallback;

  return bigger ? name[0].toUpperCase() + name.slice(1) : name;
}

export function nextUniqueName(refName: string, nameCountMap: Map<string, number>) {
  // abc_123 -> abc
  const baseName = refName.replace(/_[1-9]\d*$/, '');
  const count = nameCountMap.get(baseName) || 0;
  const nextCount = count + 1;
  nameCountMap.set(baseName, nextCount);
  return nextCount === 1 ? baseName : `${baseName}_${nextCount}`;
}

export function refToType(ref: string): string {
  const segs = ref.split('/').slice(3);
  const props = segs.slice(1);
  return segs[0]! + props.map(prop => `[${JSON.stringify(prop)}]`).join('');
}

export async function formatTsCode(tsCode: string, userOptions?: Options, cwd = process.cwd()) {
  try {
    const prettier = await import('prettier');
    // 这里末尾加上 1 是因为 prettier 内部会有容错查找
    const cwdOptions = (await prettier.resolveConfig(cwd)) || (await prettier.resolveConfig(path.join(cwd, '1')));
    return prettier.format(tsCode, {
      ...cwdOptions,
      ...userOptions,
      parser: 'typescript',
    });
  }
  catch (cause) {
    return tsCode;
  }
}
