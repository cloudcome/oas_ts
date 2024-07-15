import fs from 'fs';
import path from 'path';
import process from 'process';
import { Emitter } from 'strict-event-emitter';
import { normalizeError } from 'try-flatten';
import { Printer } from '../printer';
import { formatTsCode } from '../utils/string';
import { Reader } from './Reader';
import type {
    GeneratingOptions,
    GeneratingPayload,
    GeneratingStage,
    GeneratorEmits,
    GeneratorOptions,
    GeneratorPayload,
    OpenAPIOptions,
    StrictGeneratorOptions,
} from './types';
import { isString } from '../utils/type-is';

export class Generator extends Emitter<GeneratorEmits> {
    static defaults: StrictGeneratorOptions = {
        cwd: process.cwd(),
        dest: '/src/apis',
        modules: {},
    };

    options: StrictGeneratorOptions;
    constructor(options: GeneratorOptions) {
        super();
        this.options = Object.assign({}, Generator.defaults, options) as StrictGeneratorOptions;
    }

    async generate() {
        const entries = Object.entries(this.options.modules);
        const count = entries.length;
        const payload: GeneratorPayload = { count };
        this.emit('start', payload);

        try {
            let index = 0;
            for (const [name, module] of entries) {
                const openAPI: OpenAPIOptions = isString(module) ? { document: module } : module;
                await this.generateOpenAPI(index, count, name, openAPI, this.options);
                index++;
            }
        } catch (cause) {
            const err = normalizeError(cause);
            this.emit('error', err, payload);
            throw err;
        }

        this.emit('end', payload);
    }

    protected async generateOpenAPI(index: number, count: number, module: string, openAPIOptions: OpenAPIOptions, generatorOptions: StrictGeneratorOptions) {
        const { cwd, dest, ...globalPrinter } = generatorOptions;
        const { document, ...scopePrinter } = openAPIOptions;
        const fileName = `${module}.ts`;
        const file = path.join(cwd, dest, fileName);

        // 1. 参数合并
        const printerOptions = Object.assign({}, globalPrinter, scopePrinter);
        const options: GeneratingOptions = {
            ...openAPIOptions,
            cwd,
            dest,
            ...printerOptions,
        };
        const makePayload = (step: GeneratingStage): GeneratingPayload => ({
            index,
            count,
            module,
            stage: step,
            options,
            file,
        });

        // 2. 读取
        this.emit('process', makePayload('reading'));
        const reader = new Reader();
        reader.cwd = cwd;
        const openAPIV3Document = await reader.read(document);

        // 3. 输出
        this.emit('process', makePayload('printing'));
        const printer = new Printer(openAPIV3Document, printerOptions);
        const code = printer.print({ module, file: file });

        // 4. 写入
        this.emit('process', makePayload('writing'));
        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, await formatTsCode(code), 'utf8');

        this.emit('process', makePayload('generated'));
    }
}
