export * from './const';

// @ref https://qiita.com/ssssota/items/7e05f05b57e71dfe1cf9#%E3%81%8A%E3%81%BE%E3%81%91
export type OneOf<T extends unknown[]> = T extends [infer A, ...infer B] ? A | OneOf<B> : never;
export type AllOf<T extends unknown[]> = T extends [infer A, ...infer B] ? A & AllOf<B> : unknown;
export type AnyOf<T extends unknown[]> = T extends [infer A, ...infer B] ? A | AnyOf<B> | (A & AnyOf<B>) : never;

export function resolveURL(baseURL: string, url: string, vars: Record<string, string | number> = {}) {
    // @ref https://github.com/FrontEndDev-org/openapi-axios/security/code-scanning/1
    return (
        baseURL.replace(/(?<!\/)\/+$/, '') +
        '/' +
        url
            .replace(/\{(.*?)}/g, ($0, $1) => {
                const val = vars[$1];
                return typeof val === 'number' || typeof val === 'string' ? String(val) : '';
            })
            .replace(/^\/+/, '')
    );
}
