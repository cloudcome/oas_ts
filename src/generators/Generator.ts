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

export class Generator extends Emitter<GeneratorEmits> {
    static defaults: StrictGeneratorOptions = {
        cwd: process.cwd(),
        dest: '/src/apis',
        openAPIs: [],
    };

    options: StrictGeneratorOptions;
    constructor(options: GeneratorOptions) {
        super();
        this.options = Object.assign({}, Generator.defaults, options) as StrictGeneratorOptions;
    }

    async generate() {
        const count = this.options.openAPIs.length;
        const payload: GeneratorPayload = { count };
        this.emit('start', payload);

        try {
            let index = 0;
            for (const openAPI of this.options.openAPIs) {
                await this.generateOpenAPI(index, count, openAPI, this.options);
                index++;
            }
        } catch (cause) {
            const err = normalizeError(cause);
            this.emit('error', err, payload);
            throw err;
        }

        this.emit('end', payload);
    }

    protected async generateOpenAPI(index: number, count: number, openAPIOptions: OpenAPIOptions, generatorOptions: StrictGeneratorOptions) {
        const { cwd, dest, ...globalPrinter } = generatorOptions;
        const { name, document, ...scopePrinter } = openAPIOptions;
        const fileName = `${name}.ts`;
        const filePath = path.join(cwd, dest, fileName);

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
            stage: step,
            options,
            filePath,
        });

        // 2. 读取
        this.emit('process', makePayload('reading'));
        const reader = new Reader();
        reader.cwd = cwd;
        const openAPIV3Document = await reader.read(document);

        // 3. 输出
        this.emit('process', makePayload('printing'));
        const printer = new Printer(openAPIV3Document, printerOptions);
        const text = printer.print();

        // 4. 写入
        this.emit('process', makePayload('writing'));
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.writeFileSync(filePath, await formatTsCode(text), 'utf8');

        this.emit('process', makePayload('generated'));
    }
}
