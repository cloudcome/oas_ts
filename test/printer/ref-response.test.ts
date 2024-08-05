import { Printer } from '../../src/printer';

test('ref response', () => {
    const printer = new Printer({
        openapi: '3.1.0',
        info: {
            title: 'test',
            version: '1.0.0',
        },
        paths: {
            '/test': {
                post: {
                    responses: {
                        200: {
                            $ref: '#/components/responses/test1',
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
                test1: {
                    $ref: '#/components/responses/test2',
                },
                test2: {
                    $ref: '#/components/responses/test3',
                },
                test3: {
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
            hideHeaders: true,
            hideHelpers: true,
            hideInfo: true,
            hideImports: true,
        }),
    ).toMatchInlineSnapshot(`
      "export type User = {
      "username"?:string;
      "password"?:string;
      };

      /**
       * @param [config] request config
       */
      export async function postTest(config?:AxiosRequestConfig): AxiosPromise<Array<User>> {
          return axios({
              method: "post",
              url: \`/test\`,
      ...config
          });
      }"
    `);
});
