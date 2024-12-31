import { Printer } from '../../src/printer';

test('top', () => {
    const printer = new Printer({
        openapi: '3.1.0',
        info: {
            title: 'test',
            version: '1.0.0',
        },
        paths: {
            '/': {
                get: {
                    deprecated: true,
                    description: 'aaa\nbbb\nccc',
                    summary: 'test1',
                    operationId: 'test2',
                    requestBody: {
                        content: {
                            '*': {
                                schema: {
                                    type: 'string',
                                    description: 'test4',
                                    deprecated: true,
                                    default: 'test5',
                                    example: 'test6',
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
            hideImports: true,
            hideHeaders: true,
            hideFooters: true,
            hideInfo: true,
            hideHelpers: true,
        }),
    ).toMatchInlineSnapshot(`
      "/**
       * @deprecated
       * @description aaa
       * bbb
       * ccc
       * @summary test1
       * @param data test4
       * @param [config] request config
       */
      export async function test2(data:string,config?:AxiosRequestConfig): AxiosPromise<unknown> {
          return axios({
              method: "get",
              url: \`/\`,
      data: data,
      ...config
          });
      }"
    `);
});

test('ignore miss path parameter', () => {
    const printer = new Printer({
        openapi: '3.1.0',
        info: {
            title: 'test',
            version: '1.0.0',
        },
        paths: {
            '/': {
                get: {
                    parameters: [
                        {
                            in: 'path',
                            name: 'id',
                            deprecated: true,
                            description: 'request param',
                            schema: {
                                type: 'string',
                                description: 'test7',
                                deprecated: true,
                                default: 'test8',
                                example: 'test9',
                            },
                        },
                    ],
                    requestBody: {
                        content: {
                            '*': {
                                schema: {
                                    type: 'string',
                                    description: 'test4',
                                    deprecated: true,
                                    default: 'test5',
                                    example: 'test6',
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
            hideImports: true,
            hideHeaders: true,
            hideFooters: true,
            hideInfo: true,
            hideHelpers: true,
        }),
    ).toMatchInlineSnapshot(`
      "/**
       * @param data test4
       * @param [config] request config
       */
      export async function get_2(data:string,config?:AxiosRequestConfig): AxiosPromise<unknown> {
          return axios({
              method: "get",
              url: \`/\`,
      data: data,
      ...config
          });
      }"
    `);
});

test('parameter name 不是合法 JS 变量 + 单值', () => {
    const printer = new Printer({
        openapi: '3.1.0',
        info: {
            title: 'test',
            version: '1.0.0',
        },
        paths: {
            '/pets/{pet-id}': {
                get: {
                    operationId: 'getPet',
                    parameters: [
                        {
                            in: 'path',
                            name: 'pet-id',
                            deprecated: true,
                            description: 'request param',
                            schema: {
                                type: 'string',
                                description: 'test7',
                                deprecated: true,
                                default: 'test8',
                                example: 'test9',
                            },
                        },
                        {
                            in: 'query',
                            name: 'category-id',
                            schema: {
                                type: 'string',
                            },
                        },
                        {
                            in: 'header',
                            name: 'x-auth-key',
                            schema: {
                                type: 'string',
                            },
                        },
                    ],
                    requestBody: {
                        content: {
                            '*': {
                                schema: {
                                    type: 'string',
                                    description: 'test4',
                                    deprecated: true,
                                    default: 'test5',
                                    example: 'test6',
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
            hideImports: true,
            hideHeaders: true,
            hideFooters: true,
            hideInfo: true,
            hideHelpers: true,
        }),
    ).toMatchInlineSnapshot(`
      "/**
       * @param petId request param
       * @param data test4
       * @param [xAuthKey] request param
       * @param [categoryId] request param
       * @param [config] request config
       */
      export async function getPet(petId:string,data:string,xAuthKey?:string,categoryId?:string,config?:AxiosRequestConfig): AxiosPromise<unknown> {
          return axios({
              method: "get",
              url: \`/pets/\${petId}\`,
      data: data,
      headers: {"x-auth-key": xAuthKey},
      params: {"category-id": categoryId},
      ...config
          });
      }"
    `);
});

test('parameter name 不是合法 JS 变量 + 多值', () => {
    const printer = new Printer({
        openapi: '3.1.0',
        info: {
            title: 'test',
            version: '1.0.0',
        },
        paths: {
            '/zoo/{zoo-id}/pets/{pet-id}': {
                get: {
                    operationId: 'getPet',
                    parameters: [
                        {
                            in: 'path',
                            name: 'pet-id',
                            schema: {
                                type: 'string',
                            },
                        },
                        {
                            in: 'path',
                            name: 'zoo-id',
                            schema: {
                                type: 'string',
                            },
                        },
                        {
                            in: 'query',
                            name: 'category-id',
                            schema: {
                                type: 'string',
                            },
                        },
                        {
                            in: 'query',
                            name: 'kind-id',
                            schema: {
                                type: 'string',
                            },
                        },
                        {
                            in: 'header',
                            name: 'x-auth-key',
                            schema: {
                                type: 'string',
                            },
                        },
                        {
                            in: 'header',
                            name: 'x-auth-ver',
                            schema: {
                                type: 'string',
                            },
                        },
                    ],
                    requestBody: {
                        content: {
                            '*': {
                                schema: {
                                    type: 'string',
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
            hideImports: true,
            hideHeaders: true,
            hideFooters: true,
            hideInfo: true,
            hideHelpers: true,
        }),
    ).toMatchInlineSnapshot(`
      "/**
       * @param path request params
       * @param data request data
       * @param [headers] request params
       * @param [params] request params
       * @param [config] request config
       */
      export async function getPet(path:{
      "pet-id":string;
      "zoo-id":string;
      },data:string,headers?:{
      "x-auth-key"?:string;
      "x-auth-ver"?:string;
      },params?:{
      "category-id"?:string;
      "kind-id"?:string;
      },config?:AxiosRequestConfig): AxiosPromise<unknown> {
          return axios({
              method: "get",
              url: \`/zoo/\${path['zoo-id']}/pets/\${path['pet-id']}\`,
      data: data,
      headers: headers,
      params: params,
      ...config
          });
      }"
    `);
});
