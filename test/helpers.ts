import type { OpenAPILatest } from '../src/types/openapi';
import * as crypto from 'node:crypto';
import fs from 'node:fs';
import * as os from 'node:os';
import path from 'node:path';
import { pkgName, pkgVersion } from '../src';
import { isString } from '../src/utils/type-is';

export function writeFile(name: string, data: string | Record<keyof unknown, unknown>) {
  fs.writeFileSync(path.join(__dirname, 'files', name), isString(data) ? data : JSON.stringify(data), 'utf8');
}

/**
 * 创建临时目录【必存在】
 */
export function createTempDirname() {
  const d = path.join(os.tmpdir(), pkgName, pkgVersion, `${crypto.randomUUID()}.d`);
  fs.mkdirSync(d, { recursive: true });
  return [
    d,
    () => {
      try {
        fs.rmSync(d, { force: true });
      }
      catch {
        // ignore
      }
    },
  ] as const;
}

export function exampleTest(version: string, name: string, test: (document: OpenAPILatest.Document) => string) {
  const src = path.join(__dirname, 'example-json', version, `${name}.json`);
  const dest = path.join(__dirname, 'example-dest', version, `${name}.ts`);
  const document = fs.readFileSync(src, 'utf8');
  const output = test(JSON.parse(document));
  const dir = path.dirname(dest);

  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(dest, output);
}
