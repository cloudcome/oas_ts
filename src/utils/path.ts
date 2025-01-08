import path from 'node:path';

export function isRelative(toFile: string) {
  return /^\.{1,2}[/\\]/.test(toFile);
}

export function toRelative(toFile: string, fromFile?: string) {
  if (!fromFile)
    return toFile;

  if (!path.isAbsolute(toFile))
    return toFile;

  const relative = path.relative(path.dirname(fromFile), toFile);
  return relative.startsWith('.') ? relative : `./${relative}`;
}

export function toImportPath(toFile: string, cwd: string, fromFile?: string) {
  // /a/b/c, /cwd
  if (path.isAbsolute(toFile)) {
    return fromFile ? toRelative(toFile, fromFile) : toFile;
  }

  // ./a/b/c, /cwd
  if (isRelative(toFile)) {
    return toImportPath(path.join(cwd, toFile), cwd, fromFile);
  }

  // a/b/c, /cwd
  return toFile;
}
