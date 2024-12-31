import { Printer } from '../../src/printer';

it('number', () => {
  const printer = new Printer({
    openapi: '3.1.0',
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
      hideHeaders: true,
      hideHelpers: true,
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

it('number enum', () => {
  const printer = new Printer({
    openapi: '3.1.0',
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
      hideHeaders: true,
      hideHelpers: true,
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

it('[number, null] enum', () => {
  const printer = new Printer({
    openapi: '3.1.0',
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
      hideHeaders: true,
      hideHelpers: true,
      hideInfo: true,
      hideImports: true,
    }),
  ).toMatchInlineSnapshot(`
      "/**
       * @format int64
       * @example 10
       */
      export type OrderId = (((1|3|5|7|9))|(null));"
    `);
});

it('type[]', () => {
  const printer = new Printer({
    openapi: '3.1.0',
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
      hideHeaders: true,
      hideHelpers: true,
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
      export type Order = ((number)|(string));"
    `);
});

it('allOf primitive', () => {
  const printer = new Printer({
    openapi: '3.1.0',
    info: {
      title: 'test',
      version: '1.0.0',
    },
    components: {
      schemas: {
        User: {
          type: ['object', 'null'],
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
      hideHeaders: true,
      hideHelpers: true,
      hideInfo: true,
      hideImports: true,
    }),
  ).toMatchInlineSnapshot(`
      "export type User = (({
      "username":string;
      })|(null));

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

it('explicit array', () => {
  const printer = new Printer({
    openapi: '3.1.0',
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
      hideHeaders: true,
      hideHelpers: true,
      hideInfo: true,
      hideImports: true,
    }),
  ).toMatchInlineSnapshot(`
      "export type Order = Array<
      /**
       * @description test1
       * @deprecated
       * @format int64
       * @example 10
       */
      number
      >;"
    `);
});

it('generic array', () => {
  const printer = new Printer({
    openapi: '3.1.0',
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
      hideHeaders: true,
      hideHelpers: true,
      hideInfo: true,
      hideImports: true,
    }),
  ).toMatchInlineSnapshot(`
      "export type Order = Array<
      /**
       * @description test1
       * @deprecated
       * @format int64
       * @example 10
       */
      number
      >;"
    `);
});

it('explicit object', () => {
  const printer = new Printer({
    openapi: '3.1.0',
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
      hideHeaders: true,
      hideHelpers: true,
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
      "aaa":number;
      "bbb":string;
      "ccc"?:boolean;
      };"
    `);
});

it('generic object', () => {
  const printer = new Printer({
    openapi: '3.1.0',
    info: {
      title: 'test',
      version: '1.0.0',
    },
    components: {
      schemas: {
        Pet: {
          type: 'object',
          required: ['b-b'],
          properties: {
            'aa': {
              required: true,
              type: 'object',
            },
            'b-b': {
              type: 'object',
            },
            'string': {
              type: 'object',
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
      "export type Pet = {
      "aa":UnknownObject;
      "b-b":UnknownObject;
      "string"?:UnknownObject;
      };"
    `);
});

it('additionalProperties true', () => {
  const printer = new Printer({
    openapi: '3.1.0',
    info: {
      title: 'test',
      version: '1.0.0',
    },
    components: {
      schemas: {
        Pet: {
          type: 'object',
          additionalProperties: true,
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
  ).toMatchInlineSnapshot(`"export type Pet = UnknownObject;"`);
});

it('additionalProperties false', () => {
  const printer = new Printer({
    openapi: '3.1.0',
    info: {
      title: 'test',
      version: '1.0.0',
    },
    components: {
      schemas: {
        Pet: {
          type: 'object',
          additionalProperties: false,
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
  ).toMatchInlineSnapshot(`"export type Pet = {};"`);
});

it('additionalProperties schema type', () => {
  const printer = new Printer({
    openapi: '3.1.0',
    info: {
      title: 'test',
      version: '1.0.0',
    },
    components: {
      schemas: {
        PetA: {
          type: 'object',
          additionalProperties: {
            type: 'string',
            enum: ['a', 'b'],
          },
        },
        PetB: {
          type: 'object',
          additionalProperties: {
            type: 'string',
            required: true,
            enum: ['a', 'b'],
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
      "export type PetA = {
      [key: string]:("a"|"b");
      };

      export type PetB = {
      [key: string]:("a"|"b");
      };"
    `);
});

it('additionalProperties schema ref', () => {
  const printer = new Printer({
    openapi: '3.1.0',
    info: {
      title: 'test',
      version: '1.0.0',
    },
    components: {
      schemas: {
        PetA: {
          type: 'object',
          additionalProperties: {
            $ref: '#/components/schemas/Pet1',
          },
        },
        PetB: {
          additionalProperties: {
            $ref: '#/components/schemas/Pet2',
          },
        },
        Pet1: {
          type: 'string',
          enum: ['a', 'b'],
        },
        Pet2: {
          type: 'string',
          required: true,
          enum: ['a', 'b'],
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
      "export type PetA = {
      [key: string]:Pet1;
      };

      export type PetB = {
      [key: string]:Pet2;
      };

      export type Pet1 = ("a"|"b");

      export type Pet2 = ("a"|"b");"
    `);
});
