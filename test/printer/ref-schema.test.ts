import { Printer } from '../../src/printer';

test('ref $id', () => {
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
                        t00: {
                            $ref: '#/components/schemas/t0',
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
      "t00"?:AxiosRequestConfig_2;
      };"
    `);
});
