import { expect } from 'vitest';
import { ComponentsParser } from '../../src/parsers/ComponentsParser';
import type { TypeAlias, TypeList } from '../../src/parsers/types';

test('empty components', async () => {
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

test('empty components keys', async () => {
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

test('empty ref', async () => {
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

test('ref once', async () => {
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
    expect(t).toEqual<TypeList>([
        {
            kind: 'origin',
            name: 'P',
            type: 'string',
            required: false,
        },
        {
            kind: 'alias',
            refAble: true,
            required: true,
            name: 'T',
            target: 'P',
            origin: 'P',
            props: [],
            ref: '#/components/schemas/P',
        },
    ]);
});

test('ref twice', async () => {
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
        { kind: 'origin', name: 'K', type: 'string', required: false },
        {
            kind: 'alias',
            refAble: true,
            required: true,
            name: 'P',
            target: 'K',
            origin: 'K',
            props: [],
            ref: '#/components/schemas/K',
        },
        {
            kind: 'alias',
            refAble: true,
            required: true,
            name: 'T',
            target: 'P',
            origin: 'K',
            props: [],
            ref: '#/components/schemas/P',
        },
    ]);
});

test('primitive', async () => {
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

test('object', async () => {
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
                    additionalProperties: true,
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
                {
                    kind: 'alias',
                    refAble: false,
                    required: false,
                    name: 'R',
                    target: 'R',
                    origin: 'R',
                    props: [],
                    ref: '#/components/schemas/R',
                },
                { name: 'S', type: 'string', required: true, kind: 'origin' },
                { name: '[key: string]', type: 'any', required: true, kind: 'origin' },
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

test('object required inside', async () => {
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
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            required: true,
                        },
                        R: {
                            $ref: '#/components/schemas/R',
                        },
                    },
                    required: ['B', 'S', 'N'],
                    additionalProperties: true,
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
                {
                    kind: 'alias',
                    refAble: false,
                    required: false,
                    name: 'R',
                    target: 'R',
                    origin: 'R',
                    props: [],
                    ref: '#/components/schemas/R',
                },
                { name: 'S', type: 'string', required: true, kind: 'origin' },
                { name: '[key: string]', type: 'any', required: true, kind: 'origin' },
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

test('array', async () => {
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
                    additionalProperties: {
                        $ref: '#/components/schema/T',
                    },
                },
                T: {
                    type: 'string',
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
            children: [
                { kind: 'origin', name: 'A[]', type: 'string', required: false },
                {
                    kind: 'alias',
                    name: '[key: string]',
                    target: 'T',
                    origin: 'T',
                    props: [],
                    refAble: false,
                    required: true,
                    ref: '#/components/schema/T',
                },
            ],
        },
        {
            kind: 'origin',
            name: 'T',
            type: 'string',
            required: false,
        },
    ]);
});

test('never', async () => {
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
