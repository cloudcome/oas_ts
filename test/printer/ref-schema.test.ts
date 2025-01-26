import { Printer } from '../../src/printer';

it('ref $id', () => {
  const printer = new Printer({
    openapi: '3.1.0',
    info: {
      title: 'Test',
      version: '1.0.0',
    },
    paths: {},
    components: {
      schemas: {
        AxiosRequestConfig: {
          $id: '#/components/schemas/t0',
          type: 'object',
          description: '11',
          properties: {
            aa: {
              type: 'string',
              description: '22',
            },
          },
        },
        T1: {
          type: 'object',
          properties: {
            t0: {
              $ref: '#/components/schemas/t0',
              description: '33',
            },
            t1: {
              $ref: '#/components/schemas/AxiosRequestConfig',
            },
          },
        },
      },
    },
  });

  expect(
    printer.print({
      hideHeaders: true,
      hideFooters: true,
      hideHelpers: true,
      hideImports: true,
      hideInfo: true,
      hideAlert: true,
    }),
  ).toMatchInlineSnapshot(`
      "/**
       * @description 11
       */
      export type AxiosRequestConfig_2 = {
      /**
       * @description 22
       */
      "aa"?:string;
      };

      export type T1 = {
      /**
       * @description 33
       */
      "t0"?:AxiosRequestConfig_2;
      "t1"?:AxiosRequestConfig_2;
      };"
    `);
});

it('ref $anchor', () => {
  const printer = new Printer({
    openapi: '3.1.0',
    info: {
      title: 'Test',
      version: '1.0.0',
    },
    paths: {},
    components: {
      schemas: {
        T0: {
          type: 'object',
          properties: {
            aa: {
              type: 'string',
              format: 'uuid',
              $anchor: 'aa',
            },
            bb: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  cc: {
                    $ref: '#/components/schemas/T0#aa',
                  },
                  dd: {
                    type: 'number',
                    $anchor: 'dd',
                  },
                },
              },
            },
          },
        },
        T1: {
          type: 'object',
          properties: {
            aa: {
              $ref: '#/components/schemas/T0#aa',
            },
            dd: {
              $ref: '#/components/schemas/T0#dd',
            },
          },
        },
      },
    },
  });

  expect(
    printer.print({
      hideHeaders: true,
      hideFooters: true,
      hideHelpers: true,
      hideImports: true,
      hideInfo: true,
      hideAlert: true,
    }),
  ).toMatchInlineSnapshot(`
      "export type T0 = {
      /**
       * @format uuid
       */
      "aa"?:string;
      "bb"?:Array<{
      "cc"?:DeepGet<T0, ["aa"]>;
      "dd"?:number;
      }>;
      };

      export type T1 = {
      "aa"?:DeepGet<T0, ["aa"]>;
      "dd"?:DeepGet<T0, ["bb", number, "dd"]>;
      };"
    `);
});
