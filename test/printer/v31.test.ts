import { Printer } from '../../src';

test('v3.1 schema', () => {
    const printer = new Printer({
        openapi: '3.1.0',
        info: {
            title: '1',
            version: '2',
            description: '3',
        },
        components: {
            schemas: {
                Category: {
                    $id: 'my-id',
                    title: 'Category Title',
                    description: 'Category Description',
                    properties: {
                        id: {
                            type: 'integer',
                            format: 'int64',
                            example: 1,
                        },
                        name: {
                            type: 'string',
                            example: 'Dogs',
                        },
                    },
                    xml: {
                        name: 'Category',
                    },
                },
                Pet: {
                    properties: {
                        id: {
                            type: 'integer',
                            format: 'int64',
                        },
                        category: {
                            $ref: 'my-id',
                        },
                    },
                },
            },
        },
    });

    expect(
        printer.print({
            hideInfo: true,
            hideImports: true,
        }),
    ).toMatchInlineSnapshot(`
      "/**
       * @summary Category Title
       * @description Category Description
       */
      export type Category = {
      /**
       * @format int64
       * @example 1
       */
      id?:number;
      /**
       * @example Dogs
       */
      name?:string;
      };

      export type Pet = {
      /**
       * @format int64
       */
      id?:number;
      category?:Category;
      };"
    `);
});
