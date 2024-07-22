import { Printer } from '../../src/printer';

test('ref-parameter', () => {
    const printer = new Printer({
        openapi: '3.0.0',
        info: {
            title: 'test',
            version: '1.0.0',
        },
        paths: {
            '/test/{userId}': {
                post: {
                    parameters: [
                        {
                            $ref: 'p1',
                        },
                    ],
                },
            },
        },
        components: {
            parameters: {
                test1: {
                    $id: 'p1',
                    $ref: '#/components/parameters/test2',
                },
                test2: {
                    $ref: 'p3',
                },
                test3: {
                    $id: 'p3',
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
            hideLintComments: true,
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
