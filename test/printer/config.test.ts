import { Printer } from '../../src/printer';

it('axios 模块导入名称默认', () => {
  const printer = new Printer({
    openapi: '3.1.0',
    info: {
      title: 'test',
      version: '1.0.0',
    },
    paths: {
      '/': {
        get: {},
      },
    },
  }, {
  });
  expect(printer.print({
    hideInfo: true,
    hideHelpers: true,
  })).toMatchInlineSnapshot(`
    "import {axios as axios} from "axios";
    import type {AxiosRequestConfig, AxiosPromise} from "axios";


    /**
     * @param [config] request config
     */
    export async function get_2(config?:AxiosRequestConfig): AxiosPromise<unknown> {
        return axios({
            method: "get",
            url: \`/\`,
    ...config
        });
    }"
  `);
});

it('axios 模块导入名称指定', () => {
  const printer = new Printer({
    openapi: '3.1.0',
    info: {
      title: 'test',
      version: '1.0.0',
    },
    paths: {
      '/': {
        get: {},
      },
    },
  }, {
    axiosImportName: 'axios2',
  });
  expect(printer.print({
    hideInfo: true,
    hideHelpers: true,
  })).toMatchInlineSnapshot(`
    "import {axios2 as axios} from "axios";
    import type {AxiosRequestConfig, AxiosPromise} from "axios";


    /**
     * @param [config] request config
     */
    export async function get_2(config?:AxiosRequestConfig): AxiosPromise<unknown> {
        return axios({
            method: "get",
            url: \`/\`,
    ...config
        });
    }"
  `);
});

it('axios 默认导入名称为空', () => {
  const printer = new Printer({
    openapi: '3.1.0',
    info: {
      title: 'test',
      version: '1.0.0',
    },
    paths: {
      '/': {
        get: {},
      },
    },
  }, {
    axiosImportName: '',
  });
  expect(printer.print({
    hideInfo: true,
    hideHelpers: true,
  })).toMatchInlineSnapshot(`
    "import axios from "axios";
    import type {AxiosRequestConfig, AxiosPromise} from "axios";


    /**
     * @param [config] request config
     */
    export async function get_2(config?:AxiosRequestConfig): AxiosPromise<unknown> {
        return axios({
            method: "get",
            url: \`/\`,
    ...config
        });
    }"
  `);
});
