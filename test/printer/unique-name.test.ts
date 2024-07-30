import { Printer } from '../../src/printer';

test('unique name', () => {
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
              url: resolveURL(BASE_URL,"/test"),
      ...config
          });
      }"
    `);
});
