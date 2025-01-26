import { Printer } from '../../src/printer';

it('ref parameter', () => {
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
      hideHelpers: true,
      hideInfo: true,
      hideImports: true,
    }),
  ).toMatchInlineSnapshot(`
    "/**
     * @param userId request path "userId"
     * @param [config] request config
     */
    export async function postTest(userId:number,config?:AxiosRequestConfig): AxiosResponse<unknown> {
        return axios({
            method: "POST",
            url: \`/test/\${userId}\`,
    ...config
        });
    }"
  `);
});
