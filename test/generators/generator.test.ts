import fs from 'node:fs';
import path from 'node:path';
import { Generator } from '../../src/generator/Generator';
import { createTempDirname } from '../helpers';

it('generator', async () => {
  const [tempDir, clean] = createTempDirname();
  const generator = new Generator({
    cwd: tempDir,
    modules: {
      petStore3: {
        document: path.join(__dirname, '../example-json/3.0/pet-store.json'),
      },
    },
  });

  const fn1 = vi.fn();
  generator.on('start', fn1);

  const fn2 = vi.fn();
  generator.on('end', fn2);

  const fn3 = vi.fn();
  generator.on('process', fn3);

  const fn4 = vi.fn();
  generator.on('error', fn4);

  await generator.generate();

  // console.log(tempDir);
  expect(fs.existsSync(path.join(tempDir, 'src/apis/petStore3.ts'))).toBe(true);

  expect(fn1).toBeCalledTimes(1);
  expect(fn2).toBeCalledTimes(1);
  expect(fn3).toBeCalledTimes(1 /* reading */ + 1 /* printing */ + 1 /* writing */ + 1 /* generated */);
  expect(fn4).toBeCalledTimes(0);

  clean();
});
