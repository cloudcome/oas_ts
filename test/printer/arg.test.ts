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
