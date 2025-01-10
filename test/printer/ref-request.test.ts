import { Printer } from '../../src/printer';

it('ref request', () => {
  const printer = new Printer({
    openapi: '3.1.0',
    info: {
      title: 'test',
      version: '1.0.0',
    },
    paths: {
      '/test': {
        post: {
          requestBody: {
            $ref: '#/components/requestBodies/test1',
          },
        },
      },
    },
    components: {
      schemas: {
        User: {
          properties: {
            username: {
              type: 'string',
            },
            password: {
              type: 'string',
            },
          },
        },
      },
      requestBodies: {
        test1: {
          $ref: '#/components/requestBodies/test2',
        },
        test2: {
          $ref: '#/components/requestBodies/test3',
        },
        test3: {
          content: {
            'application/json': {
              schema: {
                description: '用户列表',
                items: {
                  $ref: '#/components/schemas/User',
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
    "export type User = {
    "username"?:string;
    "password"?:string;
    };

    /**
     * @param data 用户列表
     * @param [config] request config
     */
    export async function postTest(data:
    /**
     * @description 用户列表
     */
    Array<User>
    ,config?:AxiosRequestConfig): AxiosPromise<unknown> {
        return axios({
            method: "POST",
            url: \`/test\`,
    data: data,
    ...config
        });
    }"
  `);
});
