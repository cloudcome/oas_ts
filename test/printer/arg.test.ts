import { Printer } from '../../src/printer';

it('1*path + 1*query + 1*header', () => {
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
     * @param petId request path "pet-id"
     * @param data request data
     * @param [xAuthKey] request headers "x-auth-key"
     * @param [categoryId] request params "category-id"
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

it('n*path + 1*query + 1*header', () => {
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
     * @param path request path
     * @param data request data
     * @param [xAuthKey] request headers "x-auth-key"
     * @param [categoryId] request params "category-id"
     * @param [config] request config
     */
    export async function getPet(path:{
    "pet-id":string;
    "zoo-id":string;
    },data:string,xAuthKey?:string,categoryId?:string,config?:AxiosRequestConfig): AxiosPromise<unknown> {
        return axios({
            method: "get",
            url: \`/zoo/\${path["zoo-id"]}/pets/\${path["pet-id"]}\`,
    data: data,
    headers: {"x-auth-key": xAuthKey},
    params: {"category-id": categoryId},
    ...config
        });
    }"
  `);
});

it('n*path + n*query + 1*header', () => {
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
     * @param path request path
     * @param data request data
     * @param [xAuthKey] request headers "x-auth-key"
     * @param [params] request params
     * @param [config] request config
     */
    export async function getPet(path:{
    "pet-id":string;
    "zoo-id":string;
    },data:string,xAuthKey?:string,params?:{
    "category-id"?:string;
    "kind-id"?:string;
    },config?:AxiosRequestConfig): AxiosPromise<unknown> {
        return axios({
            method: "get",
            url: \`/zoo/\${path["zoo-id"]}/pets/\${path["pet-id"]}\`,
    data: data,
    headers: {"x-auth-key": xAuthKey},
    params: params,
    ...config
        });
    }"
  `);
});

it('n*path + n*query + n*header', () => {
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
     * @param path request path
     * @param data request data
     * @param [headers] request headers
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
            url: \`/zoo/\${path["zoo-id"]}/pets/\${path["pet-id"]}\`,
    data: data,
    headers: headers,
    params: params,
    ...config
        });
    }"
  `);
});
