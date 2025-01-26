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
    hideAlert: true,
    hideHelpers: true,
  })).toMatchInlineSnapshot(`
    "import axios from "axios";
    import {type AxiosRequestConfig as AxiosRequestConfig} from "axios";
    import {type AxiosResponse as AxiosResponse} from "axios";


    /**
     * @param [config] request config
     */
    export async function get(config?:AxiosRequestConfig): AxiosResponse<unknown> {
        return axios({
            method: "GET",
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
    hideAlert: true,
    hideHelpers: true,
  })).toMatchInlineSnapshot(`
    "import {axios2 as axios} from "axios";
    import {type AxiosRequestConfig as AxiosRequestConfig} from "axios";
    import {type AxiosResponse as AxiosResponse} from "axios";


    /**
     * @param [config] request config
     */
    export async function get(config?:AxiosRequestConfig): AxiosResponse<unknown> {
        return axios({
            method: "GET",
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
    hideAlert: true,
    hideHelpers: true,
  })).toMatchInlineSnapshot(`
    "import axios from "axios";
    import {type AxiosRequestConfig as AxiosRequestConfig} from "axios";
    import {type AxiosResponse as AxiosResponse} from "axios";


    /**
     * @param [config] request config
     */
    export async function get(config?:AxiosRequestConfig): AxiosResponse<unknown> {
        return axios({
            method: "GET",
            url: \`/\`,
    ...config
        });
    }"
  `);
});

it('axios 模块和类型指定文件', () => {
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
    axiosImportFile: '/a/b/request.ts',
    axiosRequestConfigTypeName: 'AxiosRequestConfig2',
    axiosResponseTypeName: 'AxiosResponse2',
    axiosTypeImportFile: '/a/c/request-types.ts',
  });
  expect(printer.print({
    file: '/a/d/my-api.ts',
    hideInfo: true,
    hideAlert: true,
    hideHelpers: true,
  })).toMatchInlineSnapshot(`
    "import {axios2 as axios} from "../b/request.ts";
    import {type AxiosRequestConfig2 as AxiosRequestConfig} from "../c/request-types.ts";
    import {type AxiosResponse2 as AxiosResponse} from "../c/request-types.ts";


    /**
     * @param [config] request config
     */
    export async function get(config?:AxiosRequestConfig): AxiosResponse<unknown> {
        return axios({
            method: "GET",
            url: \`/\`,
    ...config
        });
    }"
  `);
});
