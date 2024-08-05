import type { Nullable } from 'vitest';
import { Printer } from '../../src/printer';

test('ref $id', () => {
    const printer = new Printer({
        openapi: '3.1.0',
        info: {
            title: 'Test',
            version: '1.0.0',
        },
        paths: {},
        components: {
            schemas: {
                AxiosRequestConfig: {
                    $id: '#/components/schemas/t0',
                    type: 'object',
                    description: '11',
                    properties: {
                        aa: {
                            type: 'string',
                            description: '22',
                        },
                    },
                },
                T1: {
                    type: 'object',
                    properties: {
                        t0: {
                            $ref: '#/components/schemas/t0',
                            description: '33',
                        },
                        t00: {
                            $ref: '#/components/schemas/t0',
                        },
                    },
                },
            },
        },
    });

    expect(
        printer.print({
            hideHeaders: true,
            hideFooters: true,
            hideHelpers: true,
            hideImports: true,
            hideInfo: true,
        }),
    ).toMatchInlineSnapshot(`
      "/**
       * @description 11
       */
      export type AxiosRequestConfig_2 = {
      /**
       * @description 22
       */
      "aa"?:string;
      };

      export type T1 = {
      /**
       * @description 33
       */
      "t0"?:AxiosRequestConfig_2;
      "t00"?:AxiosRequestConfig_2;
      };"
    `);
});

test('ref $anchor', () => {
    const printer = new Printer({
        openapi: '3.1.0',
        info: {
            title: 'Test',
            version: '1.0.0',
        },
        paths: {},
        components: {
            schemas: {
                T0: {
                    type: 'object',
                    properties: {
                        aa: {
                            type: 'string',
                            format: 'uuid',
                            $anchor: 'aa',
                        },
                        bb: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    cc: {
                                        $ref: '#/components/schemas/T0#aa',
                                    },
                                    dd: {
                                        type: 'number',
                                        $anchor: 'dd',
                                    },
                                },
                            },
                        },
                    },
                },
                T1: {
                    type: 'object',
                    properties: {
                        aa: {
                            $ref: '#/components/schemas/T0#aa',
                        },
                        dd: {
                            $ref: '#/components/schemas/T0#dd',
                        },
                    },
                },
            },
        },
    });

    expect(
        printer.print({
            hideHeaders: true,
            hideFooters: true,
            hideHelpers: true,
            hideImports: true,
            hideInfo: true,
        }),
    ).toMatchInlineSnapshot(`
      "export type T0 = {
      /**
       * @format uuid
       */
      "aa"?:string;
      "bb"?:{
      "cc"?:DeepGet<T0, ["aa"]>;
      "dd"?:number;
      }[];
      };

      export type T1 = {
      "aa"?:DeepGet<T0, ["aa"]>;
      "dd"?:DeepGet<T0, ["bb", number, "dd"]>;
      };"
    `);
});
