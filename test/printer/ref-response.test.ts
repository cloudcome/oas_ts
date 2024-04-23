import { Printer } from '../../src';

test('ref-response', () => {
    const printer = new Printer({
        openapi: '3.0.0',
        info: {
            title: 'test',
            version: '1.0.0',
        },
        paths: {
            '/test': {
                post: {
                    responses: {
                        200: {
                            $ref: '#/components/responses/test',
                        },
                    },
                },
            },
        },
        components: {
            schemas: {
                User: {
                    properties: {
                        username: {
                            type: 'string',
                        },
                        password: {
                            type: 'string',
                        },
                    },
                },
            },
            responses: {
                test: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'array',
                                items: {
                                    $ref: '#/components/schemas/User',
                                },
                            },
                        },
                    },
                },
            },
        },
    });
    expect(
        printer.print({
            hideInfo: true,
            hideImports: true,
        }),
    ).toMatchInlineSnapshot(`
      "export type User = {
      username?:string;
      password?:string;
      };

      /**
       * @param [config] request config
       */
              export async function postTest(config?:AxiosRequestConfig): AxiosPromise<((User)[])> {
                  return axios({
                      method: "post",
                      url:resolveURL(BASE_URL,"/test"),
      ...config
                  });
              }"
    `);
});
