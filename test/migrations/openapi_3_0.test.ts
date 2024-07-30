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
