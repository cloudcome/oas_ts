import { Printer } from '../../src/printer';

it('1路径 + 1请求', () => {
  const printer = new Printer({
    info: {
      title: 'api',
      version: 'v1',
    },
    openapi: '3.1.0',
    paths: {
      '/api/abc': {
        get: {},
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
      "/**
       * @param [config] request config
       */
      export async function getApiAbc(config?:AxiosRequestConfig): AxiosPromise<unknown> {
          return axios({
              method: "get",
              url: \`/api/abc\`,
      ...config
          });
      }"
    `);
});

it('1路径 + 1请求 * module', () => {
  const printer = new Printer({
    info: {
      title: 'api',
      version: 'v1',
    },
    openapi: '3.1.0',
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
      hideHelpers: true,
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
              url: \`/api/abc\`,
      ...config
          });
      }"
    `);
});

it('1路径 + 2请求', () => {
  const printer = new Printer({
    info: {
      title: 'api',
      version: 'v1',
    },
    openapi: '3.1.0',
    paths: {
      '/api/abc': {
        get: {},
        post: {},
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
      "/**
       * @param [config] request config
       */
      export async function getApiAbc(config?:AxiosRequestConfig): AxiosPromise<unknown> {
          return axios({
              method: "get",
              url: \`/api/abc\`,
      ...config
          });
      }

      /**
       * @param [config] request config
       */
      export async function postApiAbc(config?:AxiosRequestConfig): AxiosPromise<unknown> {
          return axios({
              method: "post",
              url: \`/api/abc\`,
      ...config
          });
      }"
    `);
});

it('1路径 + 1请求 + 1query', () => {
  const printer = new Printer({
    info: {
      title: 'api',
      version: 'v1',
    },
    openapi: '3.1.0',
    paths: {
      '/api/abc': {
        get: {
          parameters: [
            {
              name: 'var',
              in: 'query',
              description: 'description 1',
              schema: {
                description: 'description 2',
                type: 'number',
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
      hideHeaders: true,
      hideHelpers: true,
      hideInfo: true,
      hideImports: true,
    }),
  ).toMatchInlineSnapshot(`
      "/**
       * @param [var_2] description 1
       * @param [config] request config
       */
      export async function getApiAbc(var_2?:number,config?:AxiosRequestConfig): AxiosPromise<unknown> {
          return axios({
              method: "get",
              url: \`/api/abc\`,
      params: {"var": var_2},
      ...config
          });
      }"
    `);
});

it('1路径 + 1请求 + 1query with duplicate', () => {
  const printer = new Printer({
    info: {
      title: 'api',
      version: 'v1',
    },
    openapi: '3.1.0',
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
      hideHeaders: true,
      hideHelpers: true,
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
              url: \`/api/abc\`,
      params: {"config": config},
      ...config_2
          });
      }"
    `);
});

it('1路径 + 1请求 + 1path', () => {
  const printer = new Printer({
    info: {
      title: 'api',
      version: 'v1',
    },
    openapi: '3.1.0',
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
      hideHeaders: true,
      hideHelpers: true,
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
              url: \`/api/abc/\${var_2}\`,
      ...config
          });
      }"
    `);
});

it('1路径 + 1请求 + 2path', () => {
  const printer = new Printer({
    info: {
      title: 'api',
      version: 'v1',
    },
    openapi: '3.1.0',
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
      hideHeaders: true,
      hideHelpers: true,
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
      "xyz":number;
      },config?:AxiosRequestConfig): AxiosPromise<unknown> {
          return axios({
              method: "get",
              url: \`/api/abc/\${path['var']}/def/\${path['xyz']}\`,
      ...config
          });
      }"
    `);
});

it('1路径 + 1请求 + 2query', () => {
  const printer = new Printer({
    info: {
      title: 'api',
      version: 'v1',
    },
    openapi: '3.1.0',
    paths: {
      '/api/abc': {
        get: {
          parameters: [
            {
              name: 'a',
              in: 'query',
              description: 'description 1',
              schema: {
                description: 'description 2',
                type: 'string',
              },
            },
            {
              name: 'b',
              in: 'query',
              required: true,
              schema: {
                description: 'description 3',
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
      hideHeaders: true,
      hideHelpers: true,
      hideInfo: true,
      hideImports: true,
    }),
  ).toMatchInlineSnapshot(`
      "/**
       * @param params request params
       * @param [config] request config
       */
      export async function getApiAbc(params:{
      /**
       * @description description 1
       */
      "a"?:string;
      /**
       * @description description 3
       */
      "b":string;
      },config?:AxiosRequestConfig): AxiosPromise<unknown> {
          return axios({
              method: "get",
              url: \`/api/abc\`,
      params: params,
      ...config
          });
      }"
    `);
});

it('1路径 + 1请求 + 2query + 1path', () => {
  const printer = new Printer({
    info: {
      title: 'api',
      version: 'v1',
    },
    openapi: '3.1.0',
    paths: {
      '/api/abc/{params}': {
        get: {
          parameters: [
            {
              name: 'a',
              in: 'query',
              required: true,
              description: 'test--',
              deprecated: true,
              schema: {
                type: 'string',
              },
            },
            {
              name: 'b',
              in: 'query',
              required: true,
              schema: {
                type: 'string',
                description: 'xxx',
              },
            },
            {
              name: 'params',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
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
      hideHeaders: true,
      hideHelpers: true,
      hideInfo: true,
      hideImports: true,
    }),
  ).toMatchInlineSnapshot(`
      "/**
       * @param params xxx
       * @param params_2 request params
       * @param [config] request config
       */
      export async function getApiAbc(params:string,params_2:{
      /**
       * @description test--
       * @deprecated
       */
      "a":string;
      /**
       * @description xxx
       */
      "b":string;
      },config?:AxiosRequestConfig): AxiosPromise<unknown> {
          return axios({
              method: "get",
              url: \`/api/abc/\${params}\`,
      params: params_2,
      ...config
          });
      }"
    `);
});

it('1路径 + 1请求 + 2query + 1path + 1request primitive', () => {
  const printer = new Printer({
    info: {
      title: 'api',
      version: 'v1',
    },
    openapi: '3.1.0',
    paths: {
      '/api/abc/{c}': {
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
              required: true,
              schema: {
                type: 'string',
                description: 'xxx',
              },
            },
            {
              name: 'c',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
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
      hideHeaders: true,
      hideHelpers: true,
      hideInfo: true,
      hideImports: true,
    }),
  ).toMatchInlineSnapshot(`
      "/**
       * @param c xxx
       * @param params request params
       * @param data aaa
       * @param [config] request config
       */
      export async function getApiAbc(c:string,params:{
      "a":string;
      /**
       * @description xxx
       */
      "b":string;
      },data:string,config?:AxiosRequestConfig): AxiosPromise<unknown> {
          return axios({
              method: "get",
              url: \`/api/abc/\${c}\`,
      params: params,
      data: data,
      ...config
          });
      }"
    `);
});

it('1路径 + 1请求 + 2query + 1path + 1request object', () => {
  const printer = new Printer({
    info: {
      title: 'api',
      version: 'v1',
    },
    openapi: '3.1.0',
    paths: {
      '/api/abc/{c}': {
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
              required: true,
              schema: {
                type: 'string',
                description: 'xxx',
              },
            },
            {
              name: 'c',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
                description: 'xxx',
              },
            },
          ],
          requestBody: {
            description: 'request--data--description',
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
      hideHeaders: true,
      hideHelpers: true,
      hideInfo: true,
      hideImports: true,
    }),
  ).toMatchInlineSnapshot(`
      "/**
       * @param c xxx
       * @param params request params
       * @param data request--data--description
       * @param [config] request config
       */
      export async function getApiAbc(c:string,params:{
      "a":string;
      /**
       * @description xxx
       */
      "b":string;
      },data:{
      /**
       * @description yyy
       */
      "name":string;
      },config?:AxiosRequestConfig): AxiosPromise<unknown> {
          return axios({
              method: "get",
              url: \`/api/abc/\${c}\`,
      params: params,
      data: data,
      ...config
          });
      }"
    `);
});

it('1路径 + 1请求 + 2query + 1path + 1request object + 1response primitive', () => {
  const printer = new Printer({
    info: {
      title: 'api',
      version: 'v1',
    },
    openapi: '3.1.0',
    paths: {
      '/api/abc/{c}': {
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
              required: true,
              schema: {
                type: 'string',
                description: 'xxx',
              },
            },
            {
              name: 'c',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
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
      hideHeaders: true,
      hideHelpers: true,
      hideInfo: true,
      hideImports: true,
    }),
  ).toMatchInlineSnapshot(`
      "/**
       * @param c xxx
       * @param params request params
       * @param data request data
       * @param [config] request config
       * @returns success
       */
      export async function getApiAbc(c:string,params:{
      "a":string;
      /**
       * @description xxx
       */
      "b":string;
      },data:{
      /**
       * @description yyy
       */
      "name":string;
      },config?:AxiosRequestConfig): AxiosPromise<string> {
          return axios({
              method: "get",
              url: \`/api/abc/\${c}\`,
      params: params,
      data: data,
      ...config
          });
      }"
    `);
});

it('1路径 + 1请求 + 2query + 1path + 1request object + 1response object', () => {
  const printer = new Printer({
    info: {
      title: 'api',
      version: 'v1',
    },
    openapi: '3.1.0',
    paths: {
      '/api/abc/{data}/def': {
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
      hideHeaders: true,
      hideHelpers: true,
      hideInfo: true,
      hideImports: true,
    }),
  ).toMatchInlineSnapshot(`
      "/**
       * @param data xxx
       * @param params request params
       * @param data_2 request data
       * @param [config] request config
       * @returns success
       */
      export async function getApiAbcDef(data:string,params:{
      "config":string;
      /**
       * @description xxx
       */
      "path":string;
      },data_2:{
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
              url: \`/api/abc/\${data}/def\`,
      params: params,
      data: data_2,
      ...config
          });
      }"
    `);
});
