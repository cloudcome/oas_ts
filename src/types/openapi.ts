export type * as OpenAPIV2 from './openapi-2_0';
export type * as OpenAPIV3 from './openapi-3_0';
export type * as OpenAPIV3_1 from './openapi-3_1';
export type * as OpenAPILatest from './openapi-3_1';
export type * as OpenAPIAll from './openapi-all';

export enum OpenAPIVersion {
    /**
     * OpenAPI 2.0.0
     * {@link} https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md
     */
    V2_0 = '2.0.0',

    /**
     * OpenAPI 3.0.3
     * {@link} https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md
     */
    V3_0 = '3.0.3',

    /**
     * OpenAPI 3.1.0
     * {@link} https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md
     */
    V3_1 = '3.1.0',
}
