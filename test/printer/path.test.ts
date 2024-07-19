import { Printer } from '../../src/printer';

test('1路径 + 1请求', () => {
    const printer = new Printer({
        info: {
            title: 'api',
            version: 'v1',
        },
        openapi: '3.0.0',
        paths: {
            '/api/abc': {
                get: {},
            },
        },
    });

    expect(
        printer.print({
            hideInfo: true,
            hideImports: true,
        }),
    ).toMatchInlineSnapshot(`
      "/**
       * @param [config] request config
       */
              export async function getApiAbc(config?:AxiosRequestConfig): AxiosPromise<unknown> {
                  return axios({
                      method: "get",
                      url:resolveURL(BASE_URL,"/api/abc"),
      ...config
                  });
              }"
    `);
});

test('1路径 + 1请求 * module', () => {
    const printer = new Printer({
        info: {
            title: 'api',
            version: 'v1',
        },
        openapi: '3.0.0',
        paths: {
            '/api/abc': {
                get: {},
            },
        },
    });

    expect(
        printer.print({
            module: 'TTT',
            hideImports: true,
        }),
    ).toMatchInlineSnapshot(`
      "/**
       * @module TTT
       * @title api
       * @version v1
       */

      /**
       * @module TTT
       * @param [config] request config
       */
              export async function getApiAbc(config?:AxiosRequestConfig): AxiosPromise<unknown> {
                  return axios({
                      method: "get",
                      url:resolveURL(BASE_URL,"/api/abc"),
      ...config
                  });
              }"
    `);
});

test('1路径 + 2请求', () => {
    const printer = new Printer({
        info: {
            title: 'api',
            version: 'v1',
        },
        openapi: '3.0.0',
        paths: {
            '/api/abc': {
                get: {},
                post: {},
            },
        },
    });

    expect(
        printer.print({
            hideInfo: true,
            hideImports: true,
        }),
    ).toMatchInlineSnapshot(`
      "/**
       * @param [config] request config
       */
              export async function getApiAbc(config?:AxiosRequestConfig): AxiosPromise<unknown> {
                  return axios({
                      method: "get",
                      url:resolveURL(BASE_URL,"/api/abc"),
      ...config
                  });
              }

      /**
       * @param [config] request config
       */
              export async function postApiAbc(config?:AxiosRequestConfig): AxiosPromise<unknown> {
                  return axios({
                      method: "post",
                      url:resolveURL(BASE_URL,"/api/abc"),
      ...config
                  });
              }"
    `);
});

test('1路径 + 1请求 + 1query', () => {
    const printer = new Printer({
        info: {
            title: 'api',
            version: 'v1',
        },
        openapi: '3.0.0',
        paths: {
            '/api/abc': {
                get: {
                    parameters: [
                        {
                            name: 'config',
                            in: 'query',
                            schema: {
                                type: 'string',
                            },
                        },
                    ],
                    responses: {
                        200: {
                            description: 'success',
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
      "/**
       * @param [config] request param
       * @param [config_2] request config
       */
              export async function getApiAbc(config?:string,config_2?:AxiosRequestConfig): AxiosPromise<unknown> {
                  return axios({
                      method: "get",
                      config:{config:config},
      url:resolveURL(BASE_URL,"/api/abc"),
      ...config_2
                  });
              }"
    `);
});

test('1路径 + 1请求 + 1path', () => {
    const printer = new Printer({
        info: {
            title: 'api',
            version: 'v1',
        },
        openapi: '3.0.0',
        paths: {
            '/api/abc/{var}': {
                get: {
                    parameters: [
                        {
                            name: 'var',
                            required: true,
                            in: 'path',
                            schema: {
                                type: 'string',
                            },
                        },
                    ],
                    responses: {
                        200: {
                            description: 'success',
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
      "/**
       * @param var_2 request param
       * @param [config] request config
       */
              export async function getApiAbc(var_2:string,config?:AxiosRequestConfig): AxiosPromise<unknown> {
                  return axios({
                      method: "get",
                      url:resolveURL(BASE_URL,"/api/abc/{var}",{var:var_2}),
      ...config
                  });
              }"
    `);
});

test('1路径 + 1请求 + 2path', () => {
    const printer = new Printer({
        info: {
            title: 'api',
            version: 'v1',
        },
        openapi: '3.0.0',
        paths: {
            '/api/abc/{var}/def/{xyz}': {
                get: {
                    parameters: [
                        {
                            name: 'var',
                            required: true,
                            in: 'path',
                            schema: {
                                type: 'string',
                            },
                        },
                        {
                            name: 'xyz',
                            in: 'path',
                            schema: {
                                type: 'integer',
                            },
                        },
                    ],
                    responses: {
                        200: {
                            description: 'success',
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
      "/**
       * @param path request params
       * @param [config] request config
       */
              export async function getApiAbcDef(path:{
      "var":string;
      /**
       * @format integer
       */
      "xyz"?:number;
      },config?:AxiosRequestConfig): AxiosPromise<unknown> {
                  return axios({
                      method: "get",
                      url:resolveURL(BASE_URL,"/api/abc/{var}/def/{xyz}",path),
      ...config
                  });
              }"
    `);
});

test('1路径 + 1请求 + 2query', () => {
    const printer = new Printer({
        info: {
            title: 'api',
            version: 'v1',
        },
        openapi: '3.0.0',
        paths: {
            '/api/abc': {
                get: {
                    parameters: [
                        {
                            name: 'a',
                            in: 'query',
                            schema: {
                                type: 'string',
                            },
                        },
                        {
                            name: 'b',
                            in: 'query',
                            schema: {
                                type: 'string',
                                required: true,
                                description: 'xxx',
                            },
                        },
                    ],
                    responses: {
                        200: {
                            description: 'success',
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
      "/**
       * @param [params] request params
       * @param [config] request config
       */
              export async function getApiAbc(params?:{
      "a"?:string;
      /**
       * @description xxx
       */
      "b":string;
      },config?:AxiosRequestConfig): AxiosPromise<unknown> {
                  return axios({
                      method: "get",
                      params:params,
      url:resolveURL(BASE_URL,"/api/abc"),
      ...config
                  });
              }"
    `);
});

test('1路径 + 1请求 + 2query + 1path', () => {
    const printer = new Printer({
        info: {
            title: 'api',
            version: 'v1',
        },
        openapi: '3.0.0',
        paths: {
            '/api/abc/{params}': {
                get: {
                    parameters: [
                        {
                            name: 'a',
                            in: 'query',
                            required: true,
                            schema: {
                                type: 'string',
                            },
                        },
                        {
                            name: 'b',
                            in: 'query',
                            schema: {
                                type: 'string',
                                required: true,
                                description: 'xxx',
                            },
                        },
                        {
                            name: 'params',
                            in: 'path',
                            schema: {
                                type: 'string',
                                required: true,
                                description: 'xxx',
                            },
                        },
                    ],
                    responses: {
                        200: {
                            description: 'success',
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
      "/**
       * @param params request params
       * @param params_2 xxx
       * @param [config] request config
       */
              export async function getApiAbc(params:{
      "a":string;
      /**
       * @description xxx
       */
      "b":string;
      },params_2:string,config?:AxiosRequestConfig): AxiosPromise<unknown> {
                  return axios({
                      method: "get",
                      params:params,
      url:resolveURL(BASE_URL,"/api/abc/{params}",{params:params_2}),
      ...config
                  });
              }"
    `);
});

test('1路径 + 1请求 + 2query + 1path + 1request primitive', () => {
    const printer = new Printer({
        info: {
            title: 'api',
            version: 'v1',
        },
        openapi: '3.0.0',
        paths: {
            '/api/abc': {
                get: {
                    parameters: [
                        {
                            name: 'a',
                            in: 'query',
                            required: true,
                            schema: {
                                type: 'string',
                            },
                        },
                        {
                            name: 'b',
                            in: 'query',
                            schema: {
                                type: 'string',
                                required: true,
                                description: 'xxx',
                            },
                        },
                        {
                            name: 'c',
                            in: 'path',
                            schema: {
                                type: 'string',
                                required: true,
                                description: 'xxx',
                            },
                        },
                    ],
                    requestBody: {
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'string',
                                    description: 'aaa',
                                },
                            },
                        },
                    },
                    responses: {
                        200: {
                            description: 'success',
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
      "/**
       * @param params request params
       * @param c xxx
       * @param data aaa
       * @param [config] request config
       */
              export async function getApiAbc(params:{
      "a":string;
      /**
       * @description xxx
       */
      "b":string;
      },c:string,data:string,config?:AxiosRequestConfig): AxiosPromise<unknown> {
                  return axios({
                      method: "get",
                      params:params,
      url:resolveURL(BASE_URL,"/api/abc",{c:c}),
      data:data,
      ...config
                  });
              }"
    `);
});

test('1路径 + 1请求 + 2query + 1path + 1request object', () => {
    const printer = new Printer({
        info: {
            title: 'api',
            version: 'v1',
        },
        openapi: '3.0.0',
        paths: {
            '/api/abc': {
                get: {
                    parameters: [
                        {
                            name: 'a',
                            in: 'query',
                            required: true,
                            schema: {
                                type: 'string',
                            },
                        },
                        {
                            name: 'b',
                            in: 'query',
                            schema: {
                                type: 'string',
                                required: true,
                                description: 'xxx',
                            },
                        },
                        {
                            name: 'c',
                            in: 'path',
                            schema: {
                                type: 'string',
                                required: true,
                                description: 'xxx',
                            },
                        },
                    ],
                    requestBody: {
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        name: {
                                            type: 'string',
                                            required: true,
                                            description: 'yyy',
                                        },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        200: {
                            description: 'success',
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
      "/**
       * @param params request params
       * @param c xxx
       * @param data request param
       * @param [config] request config
       */
              export async function getApiAbc(params:{
      "a":string;
      /**
       * @description xxx
       */
      "b":string;
      },c:string,data:{
      /**
       * @description yyy
       */
      "name":string;
      },config?:AxiosRequestConfig): AxiosPromise<unknown> {
                  return axios({
                      method: "get",
                      params:params,
      url:resolveURL(BASE_URL,"/api/abc",{c:c}),
      data:data,
      ...config
                  });
              }"
    `);
});

test('1路径 + 1请求 + 2query + 1path + 1request object + 1response primitive', () => {
    const printer = new Printer({
        info: {
            title: 'api',
            version: 'v1',
        },
        openapi: '3.0.0',
        paths: {
            '/api/abc': {
                get: {
                    parameters: [
                        {
                            name: 'a',
                            in: 'query',
                            required: true,
                            schema: {
                                type: 'string',
                            },
                        },
                        {
                            name: 'b',
                            in: 'query',
                            schema: {
                                type: 'string',
                                required: true,
                                description: 'xxx',
                            },
                        },
                        {
                            name: 'c',
                            in: 'path',
                            schema: {
                                type: 'string',
                                required: true,
                                description: 'xxx',
                            },
                        },
                    ],
                    requestBody: {
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        name: {
                                            type: 'string',
                                            required: true,
                                            description: 'yyy',
                                        },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        200: {
                            description: 'success',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'string',
                                    },
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
      "/**
       * @param params request params
       * @param c xxx
       * @param data request param
       * @param [config] request config
       * @returns success
       */
              export async function getApiAbc(params:{
      "a":string;
      /**
       * @description xxx
       */
      "b":string;
      },c:string,data:{
      /**
       * @description yyy
       */
      "name":string;
      },config?:AxiosRequestConfig): AxiosPromise<string> {
                  return axios({
                      method: "get",
                      params:params,
      url:resolveURL(BASE_URL,"/api/abc",{c:c}),
      data:data,
      ...config
                  });
              }"
    `);
});

test('1路径 + 1请求 + 2query + 1path + 1request object + 1response object', () => {
    const printer = new Printer({
        info: {
            title: 'api',
            version: 'v1',
        },
        openapi: '3.0.0',
        paths: {
            '/api/abc': {
                get: {
                    parameters: [
                        {
                            name: 'config',
                            in: 'query',
                            required: true,
                            schema: {
                                type: 'string',
                            },
                        },
                        {
                            name: 'path',
                            in: 'query',
                            schema: {
                                type: 'string',
                                required: true,
                                description: 'xxx',
                            },
                        },
                        {
                            name: 'data',
                            in: 'path',
                            schema: {
                                type: 'string',
                                required: true,
                                description: 'xxx',
                            },
                        },
                    ],
                    requestBody: {
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        name: {
                                            type: 'string',
                                            required: true,
                                            description: 'yyy',
                                        },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        200: {
                            description: 'success',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        description: 'resp---123',
                                        properties: {
                                            code: {
                                                type: 'number',
                                                description: 'aaaa',
                                            },
                                            data: {
                                                type: 'object',
                                                description: 'bbbb',
                                                properties: {
                                                    name: {
                                                        type: 'string',
                                                        description: 'cccc',
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
            },
        },
    });

    expect(
        printer.print({
            hideInfo: true,
            hideImports: true,
        }),
    ).toMatchInlineSnapshot(`
      "/**
       * @param params request params
       * @param data xxx
       * @param data_2 request param
       * @param [config] request config
       * @returns success
       */
              export async function getApiAbc(params:{
      "config":string;
      /**
       * @description xxx
       */
      "path":string;
      },data:string,data_2:{
      /**
       * @description yyy
       */
      "name":string;
      },config?:AxiosRequestConfig): AxiosPromise<{
      /**
       * @description aaaa
       */
      "code"?:number;
      /**
       * @description bbbb
       */
      "data"?:{
      /**
       * @description cccc
       */
      "name"?:string;
      };
      }> {
                  return axios({
                      method: "get",
                      params:params,
      url:resolveURL(BASE_URL,"/api/abc",{data:data}),
      data:data_2,
      ...config
                  });
              }"
    `);
});
