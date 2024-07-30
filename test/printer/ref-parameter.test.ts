import { Printer } from '../../src/printer';

test('ref-parameter', () => {
    const printer = new Printer({
        openapi: '3.1.0',
        info: {
            title: 'test',
            version: '1.0.0',
        },
        paths: {
            '/test/{userId}': {
                post: {
                    parameters: [
                        {
                            $ref: '#/components/parameters/test1',
                        },
                    ],
                },
            },
        },
        components: {
            parameters: {
                test1: {
                    $ref: '#/components/parameters/test2',
                },
                test2: {
                    $ref: '#/components/parameters/test3',
                },
                test3: {
                    in: 'path',
                    name: 'userId',
                    schema: {
                        type: 'number',
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
      "/**
       * @param [userId] request param
       * @param [config] request config
       */
      export async function postTest(userId?:number,config?:AxiosRequestConfig): AxiosPromise<unknown> {
          return axios({
              method: "post",
              url: resolveURL(BASE_URL,"/test/{userId}",{userId}),
      ...config
          });
      }"
    `);
});
