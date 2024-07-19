import { INTERNAL_NAMES, KEYWORD_NAMES } from './const';
import { fixVarName, nextUniqueName } from '../utils/string';
import { isString } from '../utils/type-is';

export class Named {
    varNameCountMap = new Map<string /*name*/, number /*count*/>();
    varNameRefMap = new Map<string /*name*/, string /*ref*/>();
    refVarNameMap = new Map<string /*ref*/, string /*name*/>();

    constructor() {
        KEYWORD_NAMES.forEach(this.internalVarName.bind(this));
        INTERNAL_NAMES.forEach(this.internalVarName.bind(this));
    }

    /**
     * 注册内部名称
     * @param {string} name
     */
    internalVarName(name: string) {
        this.varNameCountMap.set(name, 1);
    }

    nextVarName(name: string) {
        return nextUniqueName(fixVarName(name), this.varNameCountMap);
    }

    nextOperationId(method: string, url: string, operationId?: string) {
        operationId =
            operationId ||
            fixVarName(
                [
                    method,
                    url
                        .replace(/\{.*?}/g, '')
                        .split('/')
                        .filter(Boolean),
                ].join('_'),
            );
        return nextUniqueName(operationId, this.varNameCountMap);
    }

    nextTypeName(name: string) {
        const refTypeName = fixVarName(name, true, 'Type');
        return nextUniqueName(refTypeName, this.varNameCountMap);
    }

    nextRefName(name: string, ref: string) {
        const uniqueTypeName = this.nextTypeName(name);

        this.varNameRefMap.set(uniqueTypeName, ref);
        this.refVarNameMap.set(ref, uniqueTypeName);

        return uniqueTypeName;
    }

    getRefType(ref: string) {
        return this.refVarNameMap.get(ref) || '';
    }
}
