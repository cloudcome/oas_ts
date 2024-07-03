import type { OpenApi3 } from '../types/openapi';
import type { OpenApi3_Media, OpenApi3_Operation, OpenApi3_Request, OpenApi3_Response } from './helpers';

export type RequestContentContext = {
    method: string;
    url: string;
    operation: OpenApi3.OperationObject;
    content: OpenApi3_Media;
};

export type ResponsesContext = {
    method: string;
    url: string;
    operation: OpenApi3.OperationObject;
    responses: OpenApi3.ResponsesObject;
    response: OpenApi3_Response;
};

export type ResponseContentContext = {
    method: string;
    url: string;
    operation: OpenApi3.OperationObject;
    responses: OpenApi3.ResponsesObject;
    response: OpenApi3.ResponseObject;
    content: OpenApi3_Media;
};

// TODO 请求类型组件
export type ComponentRequestContentContext = {
    name: string;
    requestBody: OpenApi3_Request;
    content: OpenApi3_Media;
};

export type OperationContext = {
    method: string;
    url: string;
    operation: OpenApi3.OperationObject;
};

export type RequestContentTypeMatch = (contentType: string, context: RequestContentContext) => boolean;
export type RequestStatusCodeMatch = (statusCode: string, context: ResponsesContext) => boolean;
export type ResponseContentTypeMatch = (contentType: string, context: ResponseContentContext) => boolean;
export type OperationIdNormalize = (context: OperationContext) => string;

export type PrinterOptions = {
    /**
     * 导入名称
     * @default axios
     */
    axiosImportName?: string;

    /**
     * axios 是否具名导入
     * @default false
     * @example
     * // 具名导入
     * import { axios } from 'axios';
     * // 默认导入（非具名导入）
     * import axios from 'axios';
     */
    axiosNamedImport?: boolean;

    /**
     * 指定导入文件
     * @default axios
     */
    axiosImportFile?: string;

    /**
     * 请求配置类型名称
     * @default AxiosRequestConfig
     */
    axiosRequestConfigTypeName?: string;

    /**
     * 响应类型名称
     * @default AxiosPromise
     */
    axiosResponseTypeName?: string;

    /**
     * 基础路径
     * @default /
     */
    baseURL?: string | ((document: OpenApi3.Document) => string);

    /**
     * 请求内容类型判断
     */
    requestContentType?: string | RequestContentTypeMatch;

    /**
     * 响应状态判断
     */
    responseStatusCode?: string | RequestStatusCodeMatch;

    /**
     * 响应内容类型判断
     */
    responseContentType?: string | ResponseContentTypeMatch;

    /**
     * 处理请求 ID
     * @param {OperationContext} context
     * @returns {string}
     */
    operationIdNormalize?: OperationIdNormalize;
};

export type PrinterConfigs = {
    /**
     * 表明当前 API 所在的模块
     */
    module?: string;

    hideInfo?: boolean;
    hideImports?: boolean;
    hideComponents?: boolean;
    hidePaths?: boolean;
};
