import { fixVarName, nextUniqueName } from '../utils/string';
import { INTERNAL_TYPES, INTERNAL_VARS, KEYWORD_VARS } from './const';

export class Named {
  varNameCountMap = new Map<string /* var */, number /* count */>();
  typeNameCountMap = new Map<string /* type */, number /* count */>();
  refIdTypeMap = new Map<string /* refId */, string /* refType */>();

  constructor({ keywordVars, internalTypes, internalVars }: {
    keywordVars?: boolean;
    internalVars?: boolean;
    internalTypes?: boolean;
  } = {}) {
    if (keywordVars)
      KEYWORD_VARS.forEach(this.internalVarName.bind(this));

    if (internalVars)
      INTERNAL_VARS.forEach(this.internalVarName.bind(this));

    if (internalTypes)
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
    operationId = operationId
      || fixVarName(
        [
          method,
          url
            .replace(/\{.*?\}/g, '')
            .split('/')
            .filter(Boolean),
        ].join('_'),
      );
    return nextUniqueName(operationId, this.varNameCountMap);
  }

  nextTypeName(typeName: string) {
    const fixedTypeName = fixVarName(typeName, true, 'Type');
    return nextUniqueName(fixedTypeName, this.typeNameCountMap);
  }

  nextRefType(refType: string, refId: string) {
    const uniqueTypeName = this.nextTypeName(refType);
    this.setRefType(refId, uniqueTypeName);
    return uniqueTypeName;
  }

  setRefType(refId: string, refType: string) {
    this.refIdTypeMap.set(refId, refType);
  }

  getRefType(refId: string) {
    return this.refIdTypeMap.get(refId) || '';
  }
}
