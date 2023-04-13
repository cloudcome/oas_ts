import { ComponentsParser } from '../../src/parsers/ComponentsParser';
import { TypeAlias, TypeList } from '../../src/parsers/types';

test('empty components', () => {
  const parser = new ComponentsParser({
    info: {
      title: 'test',
      version: '1.0.0',
    },
    openapi: '3.0.0',
    paths: {},
  });

  const t = parser.parseComponents();
  expect(t).toEqual<TypeList>([]);
});

test('empty components keys', () => {
  const parser = new ComponentsParser({
    info: {
      title: 'test',
      version: '1.0.0',
    },
    openapi: '3.0.0',
    paths: {},
    components: {},
  });

  const t = parser.parseComponents();
  expect(t).toEqual<TypeList>([]);
});

test('empty ref', () => {
  const parser = new ComponentsParser({
    info: {
      title: 'test',
      version: '1.0.0',
    },
    openapi: '3.0.0',
    paths: {},
    components: {
      schemas: {
        T: {
          $ref: '#/components/schemas/P',
        },
      },
    },
  });

  const t = parser.parseComponents();
  expect((t[0] as TypeAlias).target).toEqual('');
});

test('ref once', () => {
  const parser = new ComponentsParser({
    info: {
      title: 'test',
      version: '1.0.0',
    },
    openapi: '3.0.0',
    paths: {},
    components: {
      schemas: {
        T: {
          $ref: '#/components/schemas/P',
        },
        P: {
          type: 'string',
        },
      },
    },
  });

  const t = parser.parseComponents();
  expect((t[0] as TypeAlias).target).toEqual('P');
});

test('ref twice', () => {
  const parser = new ComponentsParser({
    info: {
      title: 'test',
      version: '1.0.0',
    },
    openapi: '3.0.0',
    paths: {},
    components: {
      schemas: {
        T: {
          $ref: '#/components/schemas/P',
        },
        P: {
          $ref: '#/components/schemas/K',
        },
        K: {
          type: 'string',
        },
      },
    },
  });

  const t = parser.parseComponents();
  expect(t).toEqual<TypeList>([
    { kind: 'alias', target: 'K' },
    { kind: 'alias', target: 'K' },
    { kind: 'origin', name: 'K', type: 'string', required: false },
  ]);
});

test('primitive', () => {
  const parser = new ComponentsParser({
    info: {
      title: 'test',
      version: '1.0.0',
    },
    openapi: '3.0.0',
    paths: {},
    components: {
      schemas: {
        B: {
          type: 'boolean',
        },
        S: {
          type: 'string',
        },
        N: {
          type: 'number',
        },
        I: {
          type: 'integer',
        },
      },
    },
  });

  const t = parser.parseComponents();
  expect(t).toEqual<TypeList>([
    { name: 'B', type: 'boolean', required: false, kind: 'origin' },
    { name: 'I', type: 'number', required: false, kind: 'origin' },
    { name: 'N', type: 'number', required: false, kind: 'origin' },
    { name: 'S', type: 'string', required: false, kind: 'origin' },
  ]);
});

test('object', () => {
  const parser = new ComponentsParser({
    info: {
      title: 'test',
      version: '1.0.0',
    },
    openapi: '3.0.0',
    paths: {},
    components: {
      schemas: {
        O: {
          type: 'object',
          nullable: false,
          properties: {
            B: {
              type: 'boolean',
            },
            S: {
              type: 'string',
            },
            N: {
              type: 'number',
            },
            I: {
              type: 'integer',
            },
            R: {
              $ref: '#/components/schemas/R',
            },
          },
          required: ['B', 'S', 'N', 'I'],
        },
        R: {
          type: 'string',
        },
      },
    },
  });

  const t = parser.parseComponents();
  expect(t).toEqual<TypeList>([
    {
      kind: 'origin',
      name: 'O',
      type: 'object',
      required: true,
      children: [
        // 已重新排序
        { name: 'B', type: 'boolean', required: true, kind: 'origin' },
        { name: 'I', type: 'number', required: true, kind: 'origin' },
        { name: 'N', type: 'number', required: true, kind: 'origin' },
        { kind: 'alias', target: 'R' },
        { name: 'S', type: 'string', required: true, kind: 'origin' },
      ],
    },
    {
      kind: 'origin',
      name: 'R',
      type: 'string',
      required: false,
    },
  ]);
});

test('array', () => {
  const parser = new ComponentsParser({
    info: {
      title: 'test',
      version: '1.0.0',
    },
    openapi: '3.0.0',
    paths: {},
    components: {
      schemas: {
        A: {
          type: 'array',
          nullable: false,
          items: {
            type: 'string',
          },
        },
      },
    },
  });

  const t = parser.parseComponents();
  expect(t).toEqual<TypeList>([
    {
      kind: 'origin',
      name: 'A',
      type: 'array',
      required: true,
      children: [{ name: '', type: 'string', required: false, kind: 'origin' }],
    },
  ]);
});

test('never', () => {
  const parser = new ComponentsParser({
    info: {
      title: 'test',
      version: '1.0.0',
    },
    openapi: '3.0.0',
    paths: {},
    components: {
      schemas: {
        R: {},
      },
    },
  });

  const t = parser.parseComponents();
  expect(t).toEqual<TypeList>([
    {
      kind: 'origin',
      name: 'R',
      type: 'never',
      required: true,
    },
  ]);
});
