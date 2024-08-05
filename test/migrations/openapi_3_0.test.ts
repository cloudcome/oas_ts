import type { OpenAPIV3, OpenAPIV3_1 } from '../../src';
import { migrate_3_0To3_1 } from '../../src/migrations/openapi-3_0';

test('basic', () => {
    const v3: OpenAPIV3.Document = {
        openapi: '3.0.0',
        info: {
            title: 'test',
            version: '1.0.0',
        },
        paths: {},
    };
    const v31 = migrate_3_0To3_1(v3);

    console.log(JSON.stringify(v31));
    expect(v31).toEqual<OpenAPIV3_1.Document>({
        openapi: '3.1.0',
        info: { title: 'test', version: '1.0.0' },
        paths: {},
    });
});

test('pathItem', () => {
    const v3: OpenAPIV3.Document = {
        openapi: '3.0.0',
        info: {
            title: 'test',
            version: '1.0.0',
        },
        paths: {
            '/test': {
                get: {
                    parameters: [],
                    responses: {
                        200: {
                            description: 'ok',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            test: {
                                                type: 'array',
                                                items: {
                                                    type: 'string',
                                                },
                                            },
                                            test2: {
                                                type: 'string',
                                                nullable: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    };
    const v31 = migrate_3_0To3_1(v3);

    console.log(JSON.stringify(v31));
    expect(v31).toEqual<OpenAPIV3_1.Document>({
        openapi: '3.1.0',
        info: { title: 'test', version: '1.0.0' },
        paths: {
            '/test': {
                get: {
                    parameters: [],
                    responses: {
                        '200': {
                            description: 'ok',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: ['object'],
                                        properties: {
                                            test: { items: { type: ['string'] }, type: ['array'] },
                                            test2: { type: ['string', 'null'] },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    });
});

import petStore3 from '../example-json/3.0/pet-store.json';
import petStore3_1 from '../example-json/3.0/pet-store-3_1.json';
test('pet store', () => {
    const v3_0 = petStore3 as unknown as OpenAPIV3.Document;
    const v3_1 = migrate_3_0To3_1(v3_0);

    // console.log(JSON.stringify(v3_1));
    expect(v3_1).toEqual(petStore3_1);
});

test('nullable', () => {
    const v31 = migrate_3_0To3_1({
        openapi: '3.0.0',
        info: {
            title: 'Nullable',
            version: '1.0.0',
        },
        components: {
            schemas: {
                Users: {
                    type: 'array',
                    nullable: true,
                    items: {
                        $ref: '#/components/schemas/User',
                    },
                },
                User: {
                    type: 'object',
                    required: ['meta'],
                    properties: {
                        meta: {
                            nullable: true,
                            $ref: '#/components/schemas/UserInfo',
                        },
                        website: {
                            nullable: true,
                            allOf: [
                                {
                                    $ref: '#/components/schemas/Website',
                                },
                            ],
                        },
                    },
                },
                UserInfo: {
                    type: 'object',
                    required: ['github'],
                    properties: {
                        github: {
                            type: 'string',
                            nullable: true,
                        },
                    },
                },
                Website: {
                    type: 'object',
                    required: ['url'],
                    properties: {
                        url: {
                            type: 'string',
                            nullable: true,
                        },
                    },
                },
            },
        },
        paths: {},
    });
    // console.log(JSON.stringify(v31));

    expect(v31).toEqual<OpenAPIV3_1.Document>({
        openapi: '3.1.0',
        info: { title: 'Nullable', version: '1.0.0' },
        paths: {},
        components: {
            schemas: {
                Users: { items: { $ref: '#/components/schemas/User' }, type: ['array', 'null'] },
                User: {
                    required: ['meta'],
                    type: ['object'],
                    properties: {
                        meta: { oneOf: [{ $ref: '#/components/schemas/UserInfo' }, { type: 'null' }] },
                        website: { oneOf: [{ type: 'null' }, { allOf: [{ $ref: '#/components/schemas/Website' }] }] },
                    },
                },
                UserInfo: { required: ['github'], type: ['object'], properties: { github: { type: ['string', 'null'] } } },
                Website: { required: ['url'], type: ['object'], properties: { url: { type: ['string', 'null'] } } },
            },
            requestBodies: {},
            responses: {},
            parameters: {},
            headers: {},
        },
    });
});

test('required=true', () => {
    const v31 = migrate_3_0To3_1({
        openapi: '3.0.0',
        info: {
            title: 'Test',
            version: '1.0.0',
        },
        components: {
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        username: {
                            required: true,
                            type: 'string',
                        },
                    },
                },
            },
        },
        paths: {},
    });
    // console.log(JSON.stringify(v31));

    expect(v31).toEqual<OpenAPIV3_1.Document>({
        openapi: '3.1.0',
        info: { title: 'Test', version: '1.0.0' },
        paths: {},
        components: {
            schemas: { User: { type: ['object'], properties: { username: { required: true, type: ['string'] } } } },
            requestBodies: {},
            responses: {},
            parameters: {},
            headers: {},
        },
    });
});
