import { Printer } from '../../src/printer';

test('number', () => {
    const printer = new Printer({
        openapi: '3.0.0',
        info: {
            title: 'test',
            version: '1.0.0',
        },
        components: {
            schemas: {
                OrderId: {
                    type: 'integer',
                    format: 'int64',
                    example: 10,
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
       * @format int64
       * @example 10
       */
      export type OrderId = number;"
    `);
});

test('number enum', () => {
    const printer = new Printer({
        openapi: '3.0.0',
        info: {
            title: 'test',
            version: '1.0.0',
        },
        components: {
            schemas: {
                OrderId: {
                    type: 'integer',
                    format: 'int64',
                    example: 10,
                    enum: [1, 3, 5, 7, 9],
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
       * @format int64
       * @example 10
       */
      export type OrderId = (1|3|5|7|9);"
    `);
});

test('[number, null] enum', () => {
    const printer = new Printer({
        openapi: '3.0.0',
        info: {
            title: 'test',
            version: '1.0.0',
        },
        components: {
            schemas: {
                OrderId: {
                    type: ['integer', 'null'],
                    format: 'int64',
                    example: 10,
                    enum: [1, 3, 5, 7, 9],
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
       * @format int64
       * @example 10
       */
      export type OrderId = ((1|3|5|7|9)|null);"
    `);
});

test('type[]', () => {
    const printer = new Printer({
        openapi: '3.0.0',
        info: {
            title: 'test',
            version: '1.0.0',
        },
        components: {
            schemas: {
                Order: {
                    type: ['integer', 'string'],
                    format: 'int64',
                    example: 10,
                    description: 'test1',
                    deprecated: true,
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
       * @description test1
       * @deprecated
       * @format int64
       * @example 10
       */
      export type Order = (number|string);"
    `);
});

test('AllOf primitive', () => {
    const printer = new Printer({
        openapi: '3.0.0',
        info: {
            title: 'test',
            version: '1.0.0',
        },
        components: {
            schemas: {
                User: {
                    type: 'object',
                    nullable: true,
                    properties: {
                        username: {
                            type: 'string',
                        },
                    },
                    required: ['username'],
                },
                Order: {
                    allOf: [
                        {
                            type: 'integer',
                            format: 'int64',
                            example: 10,
                            description: 'test1',
                            deprecated: true,
                        },
                        {
                            $ref: '#/components/schemas/User',
                            description: 'test2',
                        },
                    ],
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
      "export type User = ({
      username:string;
      }) | null;

      export type Order = (
      /**
       * @description test1
       * @deprecated
       * @format int64
       * @example 10
       */
      number
      &
      /**
       * @description test2
       */
      User
      );"
    `);
});

test('explicit array', () => {
    const printer = new Printer({
        openapi: '3.0.0',
        info: {
            title: 'test',
            version: '1.0.0',
        },
        components: {
            schemas: {
                Order: {
                    type: 'array',
                    items: [
                        {
                            type: 'integer',
                            format: 'int64',
                            example: 10,
                            description: 'test1',
                            deprecated: true,
                        },
                        {
                            $ref: '#/components/schemas/User',
                            description: 'test2',
                        },
                    ],
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
      "export type Order = [
      /**
       * @description test1
       * @deprecated
       * @format int64
       * @example 10
       */
      number
      ,
      /**
       * @description test2
       */
      unknown
      ];"
    `);
});

test('generic array', () => {
    const printer = new Printer({
        openapi: '3.0.0',
        info: {
            title: 'test',
            version: '1.0.0',
        },
        components: {
            schemas: {
                Order: {
                    type: 'array',
                    items: {
                        type: 'integer',
                        format: 'int64',
                        example: 10,
                        description: 'test1',
                        deprecated: true,
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
      "export type Order = ((
      /**
       * @description test1
       * @deprecated
       * @format int64
       * @example 10
       */
      number
      )[]);"
    `);
});

test('explicit object', () => {
    const printer = new Printer({
        openapi: '3.0.0',
        info: {
            title: 'test',
            version: '1.0.0',
        },
        components: {
            schemas: {
                Order: {
                    type: 'object',
                    properties: {
                        aaa: {
                            type: 'integer',
                            format: 'int64',
                            example: 10,
                            description: 'test1',
                            deprecated: true,
                        },
                        bbb: {
                            type: 'string',
                            required: true,
                        },
                        ccc: {
                            type: 'boolean',
                        },
                    },
                    required: ['aaa'],
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
      "export type Order = {
      /**
       * @description test1
       * @deprecated
       * @format int64
       * @example 10
       */
      aaa:number;
      bbb:string;
      ccc?:boolean;
      };"
    `);
});

test('generic object', () => {
    const printer = new Printer({
        openapi: '3.0.0',
        info: {
            title: 'test',
            version: '1.0.0',
        },
        components: {
            schemas: {
                Pet: {
                    type: 'object',
                    required: ['bb'],
                    properties: {
                        aa: {
                            required: true,
                            type: 'object',
                        },
                        bb: {
                            type: 'object',
                        },
                        cc: {
                            type: 'object',
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
      "export type Pet = {
      aa:AnyObject;
      bb:AnyObject;
      cc?:AnyObject;
      };"
    `);
});
