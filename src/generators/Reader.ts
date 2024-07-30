import fs from 'fs';
import path from 'path';
import process from 'process';
import type { OpenAPILatest } from '../types/openapi';
import { request } from '../utils/request';
import { isString } from '../utils/type-is';

type AcceptDocument = OpenAPILatest.Document | string;

export class Reader {
    cwd = process.cwd();

    async read(document: AcceptDocument): Promise<OpenAPILatest.Document> {
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
        return JSON.parse(data) as OpenAPILatest.Document;
    }

    protected async readRemote(url: string) {
        return await request<OpenAPILatest.Document>(url);
    }

    protected readObject(document: OpenAPILatest.Document) {
        return document;
    }
}
