import path from 'node:path';
import { Reader } from '../../src/generator/Reader';

it('read local', async () => {
  const reader = new Reader();
  reader.cwd = path.resolve(__dirname, '../example-json/3.0');
  const document = await reader.read('pet-store.json');
  expect(document.openapi).toBeTypeOf('string');
});

it('read remote', async () => {
  const reader = new Reader();
  const document = await reader.read('https://gw.alipayobjects.com/os/antfincdn/LyDMjDyIhK/1611471979478-opa.json');
  expect(document.openapi).toEqual('3.1.0');
});

it('read object', async () => {
  const reader = new Reader();
  const document = await reader.read({
    info: {
      title: 'test',
      version: '1',
    },
    openapi: '3.0.0',
    paths: {},
  });
  expect(document.openapi).toEqual('3.1.0');
});
