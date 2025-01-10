import { Printer } from '../../src/printer';

it('upload root', () => {
  const printer = new Printer({
    openapi: '3.1.0',
    info: {
      title: 'test',
      version: '1.0.0',
    },
    paths: {
      '/upload': {
        post: {
          tags: ['upload'],
          summary: 'upload',
          description: 'upload',
          operationId: 'upload',
          requestBody: {
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'string',
                  format: 'binary',
                  description: 'A file',
                },
              },
            },
          },
        },
      },
    },
  });

  const output = printer.print({
    hideComponents: true,
    hideInfo: true,
    hideFooters: true,
    hideHeaders: true,
    hideImports: true,
    hideHelpers: true,
  });

  expect(output).toMatchInlineSnapshot(`
    "/**
     * @description upload
     * @summary upload
     * @param data A file
     * @param [config] request config
     */
    export async function upload(data:
    /**
     * @description A file
     * @format binary
     */
    Blob
    ,config?:AxiosRequestConfig): AxiosPromise<unknown> {
        return axios({
            method: "POST",
            url: \`/upload\`,
    data: data,
    ...config
        });
    }"
  `);
});

it('upload single', () => {
  const printer = new Printer({
    openapi: '3.1.0',
    info: {
      title: 'test',
      version: '1.0.0',
    },
    paths: {
      '/upload': {
        post: {
          tags: ['upload'],
          summary: 'upload',
          description: 'upload',
          operationId: 'upload',
          parameters: [
            {
              name: 'category',
              in: 'query',
              description: 'request param',
              required: true,
              schema: {
                type: 'string',
                enum: ['a', 'b'],
              },
            },
          ],
          requestBody: {
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  properties: {
                    file: {
                      type: 'string',
                      format: 'binary',
                      description: 'A file',
                      required: true,
                    },
                    name: {
                      type: 'string',
                      description: 'A name',
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

  const output = printer.print({
    hideComponents: true,
    hideInfo: true,
    hideFooters: true,
    hideHeaders: true,
    hideImports: true,
    hideHelpers: true,
  });

  expect(output).toMatchInlineSnapshot(`
    "/**
     * @description upload
     * @summary upload
     * @param category request param
     * @param data request data
     * @param [config] request config
     */
    export async function upload(category:("a"|"b"),data:{
    /**
     * @description A file
     * @format binary
     */
    "file":Blob;
    /**
     * @description A name
     */
    "name"?:string;
    },config?:AxiosRequestConfig): AxiosPromise<unknown> {
        return axios({
            method: "POST",
            url: \`/upload\`,
    params: {"category": category},
    data: data,
    ...config
        });
    }"
  `);
});

it('upload multiple', () => {
  const printer = new Printer({
    openapi: '3.1.0',
    info: {
      title: 'test',
      version: '1.0.0',
    },
    paths: {
      '/upload': {
        post: {
          tags: ['upload'],
          summary: 'upload',
          description: 'upload',
          operationId: 'upload',
          parameters: [
            {
              name: 'category',
              in: 'query',
              description: 'request param',
              required: true,
              schema: {
                type: 'string',
                enum: ['a', 'b'],
              },
            },
          ],
          requestBody: {
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  properties: {
                    file: {
                      type: 'array',
                      items: {
                        type: 'string',
                        format: 'binary',
                        description: 'A file',
                        required: true,
                      },
                    },
                    name: {
                      type: 'string',
                      description: 'A name',
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

  const output = printer.print({
    hideComponents: true,
    hideInfo: true,
    hideFooters: true,
    hideHeaders: true,
    hideImports: true,
    hideHelpers: true,
  });

  expect(output).toMatchInlineSnapshot(`
    "/**
     * @description upload
     * @summary upload
     * @param category request param
     * @param data request data
     * @param [config] request config
     */
    export async function upload(category:("a"|"b"),data:{
    "file"?:Array<
    /**
     * @description A file
     * @format binary
     */
    Blob
    >;
    /**
     * @description A name
     */
    "name"?:string;
    },config?:AxiosRequestConfig): AxiosPromise<unknown> {
        return axios({
            method: "POST",
            url: \`/upload\`,
    params: {"category": category},
    data: data,
    ...config
        });
    }"
  `);
});
