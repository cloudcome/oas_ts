import path from 'node:path';

export function toRelative(toFile: string, fromFile?: string) {
  if (!fromFile)
    return toFile;

  if (!path.isAbsolute(toFile))
    return toFile;

  const relative = path.relative(path.dirname(fromFile), toFile);
  return relative.startsWith('.') ? relative : `./${relative}`;
}
