import { OpenAPIVersion } from '../../src';
import { migrate } from '../../src/migrations';

it('migrate 2.0.0', () => {
  const v3_1 = migrate({
    swagger: '2.0.0',
    info: {
      title: 'test',
      version: '1.0.0',
    },
    paths: {},
  });
  // console.log(v3_1);
  expect(v3_1.openapi).toEqual(OpenAPIVersion.V3_1);
});

it('migrate 3.0.0', () => {
  const v3_1 = migrate({
    openapi: '3.0.0',
    info: {
      title: 'test',
      version: '1.0.0',
    },
    paths: {},
  });
  // console.log(v3_1);
  expect(v3_1.openapi).toEqual(OpenAPIVersion.V3_1);
});

it('migrate 3.1.0', () => {
  const v3_1 = migrate({
    openapi: '3.1.0',
    info: {
      title: 'test',
      version: '1.0.0',
    },
    paths: {},
  });
  // console.log(v3_1);
  expect(v3_1.openapi).toEqual(OpenAPIVersion.V3_1);
});
