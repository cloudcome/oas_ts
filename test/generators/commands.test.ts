import type { OpenAPILatest } from '../../src/types/openapi';
import fs from 'node:fs';
import path from 'node:path';
import { configFileNameOrder, generate, resolveConfig, resolveConfigFile } from '../../src/command';
import { createTempDirname } from '../helpers';

it('resolveConfigFile', async () => {
  const [cwd, clean] = createTempDirname();

  expect(resolveConfigFile(cwd)).toBeUndefined();

  [...configFileNameOrder].reverse().forEach((name, index) => {
    const file1 = path.join(cwd, name);
    const file2 = path.join(cwd, configFileNameOrder[configFileNameOrder.length - 1 - index]);
    fs.writeFileSync(file1, '', 'utf8');
    expect(resolveConfigFile(cwd)).toBe(file2);
  });

  clean();
});

it('resolveConfig', async () => {
  const [cwd, clean] = createTempDirname();

  expect(() => resolveConfig(cwd)).toThrow('配置文件未找到');

  const file = path.join(cwd, configFileNameOrder[0]);

  fs.writeFileSync(
    file,
    `module.exports = {

modules: {
    "test": {"document": "test.openapi.json"}
}

};`,
    'utf8',
  );
  expect(() => resolveConfig(cwd)).not.toThrow();

  clean();
});

it('run', async () => {
  const [cwd, clean] = createTempDirname();
  const file = path.join(cwd, configFileNameOrder[0]);

  fs.writeFileSync(
    path.join(cwd, 'test.openapi.json'),
    JSON.stringify({
      info: {
        title: 'test',
        version: '1.0.0',
      },
      openapi: '3.0.0',
      paths: {},
    } as OpenAPILatest.Document),
  );
  fs.writeFileSync(
    file,
    `module.exports = {

modules: {
    "test": "test.openapi.json"
}

};`,
    'utf8',
  );

  await generate(cwd);
  expect(fs.existsSync(path.join(cwd, 'src/apis/test.ts'))).toBe(true);

  clean();
});
