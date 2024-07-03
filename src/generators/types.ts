import type { Options } from 'prettier';
import type { PrinterOptions } from '../printer/types';
import type { OpenApi3 } from '../types/openapi';

type RequiredWith<T, K extends keyof T> = T & { [P in K]-?: T[P] };

export type OpenAPIOptions = PrinterOptions & {
    /**
     * openapi 的 document，可以是一个链接地址，也可以是本地路径，也可以是一个对象
     */
    document: OpenApi3.Document | string;
};

export type GeneratorOptions = PrinterOptions & {
    /**
     * 工作目录，默认为 process.cwd()
     */
    cwd?: string;

    /**
     * 生成文件目的地，默认为 src/apis
     */
    dest?: string;

    /**
     * 格式化配置，默认会读取当前工作目录下的配置文件
     */
    prettierOptions?: Options;

    /**
     * openapi 模块配置
     */
    modules: Record<string, OpenAPIOptions | string>;
};
export type StrictGeneratorOptions = RequiredWith<GeneratorOptions, 'cwd' | 'dest'>;

export type GeneratingStage = 'reading' | 'printing' | 'writing' | 'generated';
export type GeneratingOptions = OpenAPIOptions & Pick<StrictGeneratorOptions, 'cwd' | 'dest'>;

export interface GeneratorPayload {
    count: number;
}
export interface GeneratingPayload {
    index: number;
    count: number;
    module: string;
    stage: GeneratingStage;
    options: GeneratingOptions;
    filePath: string;
}

export type GeneratorEmits = {
    // 所有开始
    start: [GeneratorPayload];
    // 所有结束
    end: [GeneratorPayload];
    // 处理中
    process: [GeneratingPayload];
    error: [Error, GeneratorPayload];
};
