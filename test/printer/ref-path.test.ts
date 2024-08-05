import { Printer } from '../../src/printer';

test('ref path', () => {
    const printer = new Printer({
        openapi: '3.1.0',
        info: {
            title: 'test',
            version: '1.0.0',
        },
        paths: {
            '/test': {
                $ref: '#/components/pathItems/test1',
            },
        },
        components: {
            pathItems: {
                test1: {
                    $ref: '#/components/pathItems/test2',
                },
                test2: {
                    $ref: '#/components/pathItems/test3',
                },
                test3: {
                    get: {},
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
       * @param [config] request config
       */
      export async function getTest(config?:AxiosRequestConfig): AxiosPromise<unknown> {
          return axios({
              method: "get",
              url: \`/test\`,
      ...config
          });
      }"
    `);
});
