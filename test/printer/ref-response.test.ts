import { Printer } from '../../src/printer';

test('ref-response', () => {
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
       * @param [config] request config
       */
      export async function postTest(config?:AxiosRequestConfig): AxiosPromise<User> {
          return axios({
              method: "post",
              url: resolveURL(BASE_URL,"/test"),
      ...config
          });
      }"
    `);
});

test('ref-response in object', () => {
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
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        required: ['test1'],
                                        properties: {
                                            test1: {
                                                $ref: '#/components/schemas/User',
                                            },
                                            test2: {
                                                $ref: '#/components/schemas/User',
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
                User: {
                    required: ['username'],
                    properties: {
                        username: {
                            type: 'string',
                        },
                        password: {
                            type: 'string',
                            required: true,
                        },
                        location: {
                            type: 'string',
                            enum: ['china', 'america'],
                            default: 'china',
                        },
                        age: {
                            type: 'integer',
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
      "username":string;
      "password":string;
      /**
       * @default china
       */
      "location"?:("china"|"america");
      /**
       * @format integer
       */
      "age"?:number;
      };

      /**
       * @param [config] request config
       */
      export async function postTest(config?:AxiosRequestConfig): AxiosPromise<{
      "test1":User;
      "test2"?:User;
      }> {
          return axios({
              method: "post",
              url: resolveURL(BASE_URL,"/test"),
      ...config
          });
      }"
    `);
});
