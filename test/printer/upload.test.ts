import { Printer } from '../../src/printer';

test('upload root', () => {
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
      export async function upload(data:Blob,config?:AxiosRequestConfig): AxiosPromise<unknown> {
          return axios({
              method: "post",
              url: \`/upload\`,
      data: data,
      ...config
          });
      }"
    `);
});

test('upload single', () => {
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
                                    type: 'object',
                                    properties: {
                                        file: {
                                            type: 'string',
                                            format: 'binary',
                                            description: 'A file',
                                            required: true,
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
       * @param data request param
       * @param [config] request config
       */
      export async function upload(data:{
      /**
       * @description A file
       * @format binary
       */
      "file":Blob;
      },config?:AxiosRequestConfig): AxiosPromise<unknown> {
          return axios({
              method: "post",
              url: \`/upload\`,
      data: data,
      ...config
          });
      }"
    `);
});
