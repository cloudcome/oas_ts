export function isString(any: unknown): any is string {
    return typeof any === 'string';
}

export function isBoolean(any: unknown): any is boolean {
    return typeof any === 'boolean';
}

export function isNumber(any: unknown): any is number {
    return typeof any === 'number';
}

export function isArray(any: unknown): any is unknown[] {
    return Array.isArray(any);
}

export function isVarName(varName: string) {
    return /^[a-z_$]\w*$/i.test(varName);
}

export function isUndefined(any: unknown): any is undefined {
    return any === undefined;
}
