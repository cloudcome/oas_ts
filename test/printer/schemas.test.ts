import { Printer } from '../../src/printer';

test('printComponents number', () => {
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
    const text = printer.printComponents();
    expect(text).toMatchInlineSnapshot(`
      "/**
       * @format int64
       * @example 10
       */
      export type OrderId = number;
      "
    `);
});

test('printComponents number enum', () => {
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
    const text = printer.printComponents();
    expect(text).toMatchInlineSnapshot(`
      "/**
       * @format int64
       * @example 10
       */
      export type OrderId = (1|3|5|7|9);
      "
    `);
});

test('printComponents [number, null] enum', () => {
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
    const text = printer.printComponents();
    expect(text).toMatchInlineSnapshot(`
      "/**
       * @format int64
       * @example 10
       */
      export type OrderId = ((1|3|5|7|9)|null);
      "
    `);
});

test('printComponents type[]', () => {
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
    const text = printer.printComponents();
    expect(text).toMatchInlineSnapshot(`
      "/**
       * @description test1
       * @deprecated
       * @format int64
       * @example 10
       */
      export type Order = (number|string);
      "
    `);
});

test('printComponents AllOf primitive', () => {
    const printer = new Printer({
        openapi: '3.0.0',
        info: {
            title: 'test',
            version: '1.0.0',
        },
        components: {
            schemas: {
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
    printer.named.nextTypeName('User', true);
    const text = printer.printComponents();
    expect(text).toMatchInlineSnapshot(`
      "export type Order = (
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
      );
      "
    `);
});

test('printComponents primitive explicit array', () => {
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
    printer.named.nextTypeName('User', true);
    const text = printer.printComponents();
    expect(text).toMatchInlineSnapshot(`
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
      User
      ];
      "
    `);
});

test('printComponents primitive generic array', () => {
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
    printer.named.nextTypeName('User', true);
    const text = printer.printComponents();
    expect(text).toMatchInlineSnapshot(`
      "export type Order = ((
      /**
       * @description test1
       * @deprecated
       * @format int64
       * @example 10
       */
      number
      )[]);
      "
    `);
});

test('printComponents primitive object', () => {
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
                            required: true,
                        },
                    },
                    required: ['aaa'],
                },
            },
        },
    });
    printer.named.nextTypeName('User', true);
    const text = printer.printComponents();
    expect(text).toMatchInlineSnapshot(`
      "export type Order = {
      /**
       * @description test1
       * @deprecated
       * @format int64
       * @example 10
       */
      aaa:number;
      bbb:string;
      ccc:boolean;
      };
      "
    `);
});

test('printComponents primitive object', () => {
    const printer = new Printer({
        openapi: '3.0.0',
        info: {
            title: 'test',
            version: '1.0.0',
        },
        components: {
            schemas: {
                Pet: {
                    required: ['name', 'photoUrls'],
                    type: 'object',
                    properties: {
                        id: { type: 'integer', format: 'int64', example: 10 },
                        name: { type: 'string', example: 'doggie' },
                        category: { $ref: '#/components/schemas/Category' },
                        photoUrls: {
                            type: 'array',
                            xml: { wrapped: true },
                            items: { type: 'string', xml: { name: 'photoUrl' } },
                        },
                        tags: { type: 'array', xml: { wrapped: true }, items: { $ref: '#/components/schemas/Tag' } },
                        status: {
                            type: 'string',
                            description: 'pet status in the store',
                            enum: ['available', 'pending', 'sold'],
                        },
                    },
                    xml: { name: 'pet' },
                },
            },
        },
    });
    printer.named.nextTypeName('Category', true);
    printer.named.nextTypeName('Tag', true);
    const text = printer.printComponents();
    expect(text).toMatchInlineSnapshot(`
      "export type Pet = {
      /**
       * @format int64
       * @example 10
       */
      id?:number;
      /**
       * @example doggie
       */
      name:string;
      category?:Category;
      photoUrls:((string)[]);
      tags?:((Tag)[]);
      /**
       * @description pet status in the store
       */
      status?:("available"|"pending"|"sold");
      };
      "
    `);
});
