import { INTERNAL_TYPES, INTERNAL_VARS, KEYWORD_VARS } from './const';
import { fixVarName, nextUniqueName } from '../utils/string';
import { isString } from '../utils/type-is';

export class Named {
    varNameCountMap = new Map<string /*var*/, number /*count*/>();
    typeNameCountMap = new Map<string /*type*/, number /*count*/>();
    varNameRefMap = new Map<string /*name*/, string /*ref*/>();
    refVarNameMap = new Map<string /*ref*/, string /*name*/>();

    constructor() {
        KEYWORD_VARS.forEach(this.internalVarName.bind(this));
        INTERNAL_VARS.forEach(this.internalVarName.bind(this));
        INTERNAL_TYPES.forEach(this.internalTypeName.bind(this));
    }

    /**
     * 注册内部变量
     * @param {string} varName
     */
    internalVarName(varName: string) {
        this.varNameCountMap.set(varName, 1);
    }

    /**
     * 注册内部类型
     * @param {string} typeName
     */
    internalTypeName(typeName: string) {
        this.typeNameCountMap.set(typeName, 1);
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
        return nextUniqueName(refTypeName, this.typeNameCountMap);
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
