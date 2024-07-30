import type { OpenAPILatest } from '../types/openapi';
import type { OpenApiLatest_Media, OpenApiLatest_Operation, OpenApiLatest_Request, OpenApiLatest_Response } from './helpers';

export type RequestContentContext = {
    method: string;
    url: string;
    operation: OpenAPILatest.OperationObject;
    content: OpenApiLatest_Media;
};

export type ResponsesContext = {
    method: string;
    url: string;
    operation: OpenAPILatest.OperationObject;
    responses: OpenAPILatest.ResponsesObject;
    response: OpenApiLatest_Response;
};

export type ResponseContentContext = {
    method: string;
    url: string;
    operation: OpenAPILatest.OperationObject;
    responses: OpenAPILatest.ResponsesObject;
    response: OpenAPILatest.ResponseObject;
    content: OpenApiLatest_Media;
};

// TODO 请求类型组件
export type ComponentRequestContentContext = {
    name: string;
    requestBody: OpenApiLatest_Request;
    content: OpenApiLatest_Media;
};

export type OperationContext = {
    method: string;
    url: string;
    operation: OpenAPILatest.OperationObject;
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

    /**
     * 生成文件的头部信息
     */
    headers?: string[];

    /**
     * 生成文件的尾部信息
     */
    footers?: string[];
};

export type PrinterConfigs = {
    /**
     * 表明当前 API 所在的模块
     */
    module?: string;

    /**
     * file path
     */
    file?: string;

    hideHeaders?: boolean;
    hideHelpers?: boolean;
    hideFooters?: boolean;
    hideInfo?: boolean;
    hideImports?: boolean;
    hideComponents?: boolean;
    hidePaths?: boolean;
};
