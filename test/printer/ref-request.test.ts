import { Printer } from '../../src/printer';

test('ref-request', () => {
    const printer = new Printer({
        openapi: '3.1.0',
        info: {
            title: 'test',
            version: '1.0.0',
        },
        paths: {
            '/test': {
                post: {
                    requestBody: {
                        $ref: '#/components/requestBodies/test',
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
            requestBodies: {
                test: {
                    content: {
                        'application/json': {
                            schema: {
                                description: '用户列表',
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
            hideInfo: true,
            hideImports: true,
        }),
    ).toMatchInlineSnapshot(`
      "export type User = {
      "username"?:string;
      "password"?:string;
      };

      /**
       * @param data 用户列表
       * @param [config] request config
       */
      export async function postTest(data:User,config?:AxiosRequestConfig): AxiosPromise<unknown> {
          return axios({
              method: "post",
              data,
      url: resolveURL(BASE_URL,"/test"),
      ...config
          });
      }"
    `);
});
