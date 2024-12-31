import { Printer } from '../../src/printer';

test('unique vars', () => {
    const printer = new Printer({
        openapi: '3.1.0',
        info: {
            title: 'test',
            version: '1.0.0',
        },
        paths: {
            '/test': {
                get: {
                    responses: {
                        200: {
                            description: 'success',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Test_aa_',
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        components: {
            schemas: {
                Test_aa_: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                        },
                    },
                },
            },
        },
    });

    expect(
        printer.print({
            hideHeaders: true,
            hideHelpers: true,
            hideInfo: true,
            hideImports: true,
        }),
    ).toMatchInlineSnapshot(`
      "export type TestAa = {
      "name"?:string;
      };

      /**
       * @param [config] request config
       * @returns success
       */
      export async function getTest(config?:AxiosRequestConfig): AxiosPromise<TestAa> {
          return axios({
              method: "get",
              url: \`/test\`,
      ...config
          });
      }"
    `);
});

test('unique types', () => {
    const printer = new Printer({
        openapi: '3.1.0',
        info: {
            title: 'test',
            version: '1.0.0',
        },
        paths: {
            '/test/{axios}': {
                get: {
                    parameters: [
                        {
                            name: 'axios',
                            in: 'path',
                            schema: {
                                type: 'string',
                            },
                        },
                        {
                            name: 'UnknownObject',
                            in: 'query',
                            schema: {
                                $ref: '#/components/schemas/UnknownObject',
                            },
                        },
                    ],
                    responses: {
                        200: {
                            description: 'success',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            AxiosPromise: {
                                                $ref: '#/components/schemas/AxiosPromise',
                                            },
                                            UnknownObject: {
                                                $ref: '#/components/schemas/UnknownObject',
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
        components: {
            schemas: {
                AxiosPromise: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                        },
                    },
                },
                UnknownObject: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'number',
                        },
                    },
                },
            },
        },
    });

    expect(
        printer.print({
            hideHeaders: true,
            hideHelpers: true,
            hideInfo: true,
            hideImports: true,
        }),
    ).toMatchInlineSnapshot(`
      "export type AxiosPromise_2 = {
      "name"?:string;
      };

      export type UnknownObject_2 = {
      "name"?:number;
      };

      /**
       * @param axios_2 request param
       * @param [UnknownObject] request param
       * @param [config] request config
       * @returns success
       */
      export async function getTest(axios_2:string,UnknownObject?:UnknownObject_2,config?:AxiosRequestConfig): AxiosPromise<{
      "AxiosPromise"?:AxiosPromise_2;
      "UnknownObject"?:UnknownObject_2;
      }> {
          return axios({
              method: "get",
              url: \`/test/\${axios_2}\`,
      params: {"UnknownObject": UnknownObject},
      ...config
          });
      }"
    `);
});
