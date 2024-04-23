import fs from 'fs';
import path from 'path';
import process from 'process';
import type { OpenApi3 } from '../types/openapi';
import { request } from '../utils/request';
import { isString } from '../utils/type-is';

type AcceptDocument = OpenApi3.Document | string;

export class Reader {
    cwd = process.cwd();

    async read(document: AcceptDocument): Promise<OpenApi3.Document> {
        if (isString(document)) {
            if (/^https?:/i.test(document)) {
                return await this.readRemote(document);
            } else {
                return this.readLocal(document);
            }
        } else {
            return this.readObject(document);
        }
    }

    static validate(document: AcceptDocument) {
        // TODO
    }

    protected readLocal(file: string) {
        const data = fs.readFileSync(path.resolve(this.cwd, file), 'utf8');
        return JSON.parse(data) as OpenApi3.Document;
    }

    protected async readRemote(url: string) {
        return await request<OpenApi3.Document>(url);
    }

    protected readObject(document: OpenApi3.Document) {
        return document;
    }
}
