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
                    description: 'Category',
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

    expect(printer.print()).toMatchInlineSnapshot(`
      "/**
       * @title 1
       * @version 2
       * @description 3
       */

      import axios from "axios";
      import type {AxiosRequestConfig, AxiosPromise} from "axios";
      import {resolveURL} from "pkg-name-for-test/client";
      import type {OneOf} from "pkg-name-for-test/client";

      const BASE_URL="/";

      /**
       * @description Category
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
      };

      "
    `);
});
