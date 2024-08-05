/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-namespace */

import * as OpenAPIV3 from './openapi-3_0';

export type Modify<T, R> = Omit<T, keyof R> & R;
export type PathsWebhooksComponents<T extends {} = {}> = {
    paths: PathsObject<T>;
    webhooks: Record<string, PathItemObject | ReferenceObject>;
    components: ComponentsObject;
};
export type Document<T extends {} = {}> = Modify<
    Omit<OpenAPIV3.Document<T>, 'paths' | 'components'>,
    {
        info: InfoObject;
        jsonSchemaDialect?: string;
        servers?: ServerObject[];
    } & (
        | (Pick<PathsWebhooksComponents<T>, 'paths'> & Omit<Partial<PathsWebhooksComponents<T>>, 'paths'>)
        | (Pick<PathsWebhooksComponents<T>, 'webhooks'> & Omit<Partial<PathsWebhooksComponents<T>>, 'webhooks'>)
        | (Pick<PathsWebhooksComponents<T>, 'components'> & Omit<Partial<PathsWebhooksComponents<T>>, 'components'>)
    )
>;
export type InfoObject = Modify<
    OpenAPIV3.InfoObject,
    {
        summary?: string;
        license?: LicenseObject;
    }
>;
export type ContactObject = OpenAPIV3.ContactObject;
export type LicenseObject = Modify<
    OpenAPIV3.LicenseObject,
    {
        identifier?: string;
    }
>;
export type ServerObject = Modify<
    OpenAPIV3.ServerObject,
    {
        url: string;
        description?: string;
        variables?: Record<string, ServerVariableObject>;
    }
>;
export type ServerVariableObject = Modify<
    OpenAPIV3.ServerVariableObject,
    {
        enum?: [string, ...string[]];
    }
>;
export type PathsObject<T extends {} = {}, P extends {} = {}> = Record<string, (PathItemObject<T> & P) | ReferenceObject>;
export type HttpMethods = OpenAPIV3.HttpMethods;
export type PathItemObject<T extends {} = {}> = {
    $id?: string;
    summary?: string;
    description?: string;
    servers?: ServerObject[];
    parameters?: (ReferenceObject | ParameterObject)[];
} & {
    [method in HttpMethods]?: OperationObject<T>;
};
export type OperationObject<T extends {} = {}> = Modify<
    OpenAPIV3.OperationObject<T>,
    {
        parameters?: (ReferenceObject | ParameterObject)[];
        requestBody?: ReferenceObject | RequestBodyObject;
        responses?: ResponsesObject;
        callbacks?: Record<string, ReferenceObject | CallbackObject>;
        servers?: ServerObject[];
    }
> &
    T;
export type ExternalDocumentationObject = OpenAPIV3.ExternalDocumentationObject;
export interface ParameterObject extends ParameterBaseObject {
    $id?: string;
    name: string;
    in: 'query' | 'header' | 'path' | 'cookie';
}
export interface HeaderObject extends ParameterBaseObject {}
export type ParameterBaseObject = Modify<
    OpenAPIV3.ParameterBaseObject,
    {
        schema?: ReferenceObject | SchemaObject;
        examples?: {
            [media: string]: ReferenceObject | ExampleObject;
        };
        content?: {
            [media: string]: MediaTypeObject;
        };
    }
>;
export type NonArraySchemaObjectType = OpenAPIV3.NonArraySchemaObjectType | 'null';
export type ArraySchemaObjectType = OpenAPIV3.ArraySchemaObjectType;
/**
 * There is no way to tell typescript to require items when type is either 'array' or array containing 'array' type
 * 'items' will be always visible as optional
 * Casting schema object to ArraySchemaObject or NonArraySchemaObject will work fine
 */
export type SchemaObject = ArraySchemaObject | NonArraySchemaObject | MixedSchemaObject;
export interface ArraySchemaObject extends BaseSchemaObject {
    type: ArraySchemaObjectType;
    items: ReferenceObject | SchemaObject;
}
export interface NonArraySchemaObject extends BaseSchemaObject {
    type?: NonArraySchemaObjectType;
}
export interface MixedSchemaObject extends BaseSchemaObject {
    type?: (ArraySchemaObjectType | NonArraySchemaObjectType)[];
    items?: ReferenceObject | SchemaObject;
}
export type BaseSchemaObject = Modify<
    Omit<OpenAPIV3.BaseSchemaObject, 'nullable'>,
    {
        $id?: string;
        $anchor?: string;
        examples?: OpenAPIV3.BaseSchemaObject['example'][];
        exclusiveMinimum?: boolean | number;
        exclusiveMaximum?: boolean | number;
        contentMediaType?: string;
        $schema?: string;
        $vocabulary?: string;
        additionalProperties?: boolean | ReferenceObject | SchemaObject;
        properties?: {
            [name: string]: ReferenceObject | SchemaObject;
        };
        allOf?: (ReferenceObject | SchemaObject)[];
        oneOf?: (ReferenceObject | SchemaObject)[];
        anyOf?: (ReferenceObject | SchemaObject)[];
        not?: ReferenceObject | SchemaObject;
        discriminator?: DiscriminatorObject;
        externalDocs?: ExternalDocumentationObject;
        xml?: XMLObject;
        const?: any;
    }
>;
export type DiscriminatorObject = OpenAPIV3.DiscriminatorObject;
export type XMLObject = OpenAPIV3.XMLObject;
export type ReferenceObject = Modify<
    OpenAPIV3.ReferenceObject,
    {
        summary?: string;
        description?: string;
    }
>;
export type ExampleObject = OpenAPIV3.ExampleObject;
export type MediaTypeObject = Modify<
    OpenAPIV3.MediaTypeObject,
    {
        schema?: SchemaObject | ReferenceObject;
        examples?: Record<string, ReferenceObject | ExampleObject>;
    }
>;
export type EncodingObject = OpenAPIV3.EncodingObject;
export type RequestBodyObject = Modify<
    OpenAPIV3.RequestBodyObject,
    {
        $id?: string;
        content: {
            [media: string]: MediaTypeObject;
        };
    }
>;
export type ResponsesObject = Record<string, ReferenceObject | ResponseObject>;
export type ResponseObject = Modify<
    OpenAPIV3.ResponseObject,
    {
        $id?: string;
        headers?: {
            [header: string]: ReferenceObject | HeaderObject;
        };
        content?: {
            [media: string]: MediaTypeObject;
        };
        links?: {
            [link: string]: ReferenceObject | LinkObject;
        };
    }
>;
export type LinkObject = Modify<
    OpenAPIV3.LinkObject,
    {
        server?: ServerObject;
    }
>;
export type CallbackObject = Record<string, PathItemObject | ReferenceObject>;
export type SecurityRequirementObject = OpenAPIV3.SecurityRequirementObject;
export type ComponentsObject = Modify<
    OpenAPIV3.ComponentsObject,
    {
        schemas?: Record<string, ReferenceObject | SchemaObject>;
        responses?: Record<string, ReferenceObject | ResponseObject>;
        parameters?: Record<string, ReferenceObject | ParameterObject>;
        examples?: Record<string, ReferenceObject | ExampleObject>;
        requestBodies?: Record<string, ReferenceObject | RequestBodyObject>;
        headers?: Record<string, ReferenceObject | HeaderObject>;
        securitySchemes?: Record<string, ReferenceObject | SecuritySchemeObject>;
        links?: Record<string, ReferenceObject | LinkObject>;
        callbacks?: Record<string, ReferenceObject | CallbackObject>;
        pathItems?: Record<string, ReferenceObject | PathItemObject>;
    }
>;
export type SecuritySchemeObject = OpenAPIV3.SecuritySchemeObject;
export type HttpSecurityScheme = OpenAPIV3.HttpSecurityScheme;
export type ApiKeySecurityScheme = OpenAPIV3.ApiKeySecurityScheme;
export type OAuth2SecurityScheme = OpenAPIV3.OAuth2SecurityScheme;
export type OpenIdSecurityScheme = OpenAPIV3.OpenIdSecurityScheme;
export type TagObject = OpenAPIV3.TagObject;
