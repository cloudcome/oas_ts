import type { OpenAPIV2, OpenAPIV3 } from '../../src';
import { migrate_2_0To3_0 } from '../../src/migrations/openapi-2_0';

import petStore3 from '../example-json/2.0/pet-store-3_0.json';
import petStore from '../example-json/2.0/pet-store.json';

it('basic', () => {
  const v2: OpenAPIV2.Document = {
    swagger: '2.0',
    info: {
      title: 'test',
      version: '1.0.0',
    },
    paths: {},
  };
  const v3 = migrate_2_0To3_0(v2);

  // console.log(JSON.stringify(v3));
  expect(v3).toEqual<OpenAPIV3.Document>({
    openapi: '3.0.3',
    info: { title: 'test', version: '1.0.0' },
    paths: {},
    components: {},
  });
});

it('path', () => {
  const v2: OpenAPIV2.Document = {
    swagger: '2.0',
    info: {
      title: 'test',
      version: '1.0.0',
    },
    paths: {
      '/test': {
        get: {
          responses: {
            200: {
              description: 'test',
              schema: {
                type: 'object',
                properties: {
                  test: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
      },
    },
  };
  const v3 = migrate_2_0To3_0(v2);

  // console.log(JSON.stringify(v3));
  expect(v3).toEqual<OpenAPIV3.Document>({
    openapi: '3.0.3',
    info: { title: 'test', version: '1.0.0' },
    paths: {
      '/test': {
        get: {
          requestBody: { content: {} },
          responses: {
            200: {
              description: 'test',
              content: {
                '*': {
                  schema: {
                    type: 'object',
                    properties: {
                      test: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    components: {},
  });
});
it('pet store', () => {
  const v2 = petStore as OpenAPIV2.Document;
  const v3 = migrate_2_0To3_0(v2);

  // console.log(JSON.stringify(v3));
  expect(v3).toEqual(petStore3);
});
