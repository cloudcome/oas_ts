import type { OpenApi3 } from '../types/openapi';
import { isArray, isBoolean, isNumber, isString } from '../utils/type-is';
import { filterLine } from './helpers';

function formatLine(key: string, val: unknown) {
    val = key === 'externalDocs' ? JsDoc.printExternalDoc(val as OpenApi3.ExternalDocumentationObject) : val;
    key = key === 'externalDocs' ? 'see' : key;

    if (isBoolean(val) && val) return `@${key}`;
    if (isString(val) || isNumber(val)) return `@${key} ${val}`;
}

export class JsDoc {
    lines: string[] = [];

    constructor(private tags: OpenApi3.TagObject[] = []) {}

    addComments(comments: Record<string, unknown>) {
        if ('tags' in comments) {
            const tags = (comments.tags || []) as string[];
            comments.tags = undefined;
            tags.forEach((tag) => {
                const info = this.tags.find((t) => t.name === tag);
                if (!info) return;

                comments[`see ${tag}`] = [info.description, JsDoc.printExternalDoc(info.externalDocs)].filter(Boolean).join(' ');
            });
        }

        this.addLines(JsDoc.toLines(comments));
    }

    addLines(lines: string[]) {
        this.lines.push(...lines);
    }

    print() {
        if (this.lines.length === 0) return '';

        return [
            //
            '/**',
            ...this.lines.map((line) => ` * ${line}`),
            ' */',
        ].join('\n');
    }

    static toLines(comments: Record<string, unknown>) {
        return Object.entries(comments)
            .map(([key, val]) => {
                if (isArray(val)) return val.map((v) => formatLine(key, v));
                return formatLine(key, val);
            })
            .flat()
            .filter(filterLine) as string[];
    }

    static fromRef(ref: OpenApi3.ReferenceObject) {
        const { description, summary } = ref;
        return { description, summary };
    }

    static fromSchema(schema: OpenApi3.SchemaObject) {
        const { deprecated, description, default: defaultValue, format, example, title, externalDocs } = schema;
        return {
            description,
            summary: title,
            deprecated,
            default: defaultValue,
            format,
            example,
            externalDocs,
        };
    }

    static fromParameter(parameter: OpenApi3.ParameterObject) {
        const { deprecated, description, example, examples } = parameter;
        return {
            deprecated,
            description,
            example,
        };
    }

    static fromOperation(operation: OpenApi3.OperationObject) {
        const { deprecated, description, summary, tags } = operation;
        return {
            deprecated,
            description,
            summary,
            tags,
        };
    }

    static printExternalDoc(externalDoc?: OpenApi3.ExternalDocumentationObject) {
        const { url, description } = externalDoc || {};

        // {@link https://github.com GitHub}
        if (url && description) return `{@link ${url} ${description}}`;
        if (url) return `{@link ${url}}`;
        if (description) return description;
        return false;
    }
}
