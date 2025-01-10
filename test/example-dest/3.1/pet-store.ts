/**
 * @title Swagger Petstore - OpenAPI 3.1
 * @version 1.0.6
 * @contact <apiteam@swagger.io>
 * @description This is a sample Pet Store Server based on the OpenAPI 3.1 specification.
 * You can find out more about
 * Swagger at [http://swagger.io](http://swagger.io).
 * @summary Pet Store 3.1
 * @see {@link http://swagger.io Find out more about Swagger}
 */

import axios from "axios";
import {type AxiosRequestConfig as AxiosRequestConfig} from "axios";
import {type AxiosPromise as AxiosPromise} from "axios";



// helpers --- start
type OneOf<T extends unknown[]> = T extends [infer A, ...infer B] ? A | OneOf<B> : never;
type AllOf<T extends unknown[]> = T extends [infer A, ...infer B] ? A & AllOf<B> : unknown;
type AnyOf<T extends unknown[]> = T extends [infer A, ...infer B] ? A | AnyOf<B> | (A & AnyOf<B>) : never;
type UnknownObject = Record<string, unknown>;
type DeepGet<O, K> = K extends [infer P, ...infer R]
  ? O extends Record<string, any> | Array<any>
    ? P extends keyof O
      ? R['length'] extends 0
        ? O[P]
        : DeepGet<NonNullable<O[P]>, R>
      : never
    : never
  : never;
// helpers --- end
    

/**
 * @description Category
 */
export type Category = {
/**
 * @format int64
 * @example 1
 */
"id"?:number;
/**
 * @example Dogs
 */
"name"?:string;
};

/**
 * @description Pet
 */
export type Pet = {
/**
 * @format int64
 * @example 10
 */
"id"?:number;
/**
 * @description Pet Category
 */
"category"?:unknown;
/**
 * @example doggie
 */
"name":string;
"photoUrls":Array<string>;
"tags"?:Array<unknown>;
/**
 * @description pet status in the store
 */
"status"?:("available"|"pending"|"sold");
/**
 * @format int32
 * @example 7
 */
"availableInstances"?:number;
"petDetailsId"?:DeepGet<PetDetails, ["id"]>;
"petDetails"?:PetDetails;
};

export type PetDetails = {
/**
 * @format int64
 * @example 10
 */
"id"?:number;
/**
 * @description PetDetails Category
 */
"category"?:Category;
"tag"?:Tag;
};

export type Tag = {
/**
 * @format int64
 */
"id"?:number;
"name"?:string;
};

/**
 * @description Update an existing pet by Id
 * @summary Update an existing pet
 * @see pet Everything about your Pets {@link http://swagger.io Find out more}
 * @param data Pet object that needs to be updated in the store
 * @param [config] request config
 * @returns Successful operation
 */
export async function updatePet(data:
/**
 * @description A Pet in JSON Format
 */
Pet
,config?:AxiosRequestConfig): AxiosPromise<
/**
 * @description A Pet in XML Format
 */
Pet
> {
    return axios({
        method: "PUT",
        url: `/pet`,
data: data,
...config
    });
}

/**
 * @description Add a new pet to the store
 * @summary Add a new pet to the store
 * @see pet Everything about your Pets {@link http://swagger.io Find out more}
 * @param data Create a new pet in the store
 * @param [config] request config
 * @returns Successful operation
 */
export async function addPet(data:
/**
 * @description A Pet in JSON Format
 */
Pet
,config?:AxiosRequestConfig): AxiosPromise<
/**
 * @description A Pet in XML Format
 */
Pet
> {
    return axios({
        method: "POST",
        url: `/pet`,
data: data,
...config
    });
}

/**
 * @description Returns a pet when 0 < ID <= 10.  ID > 10 or nonintegers will simulate API error conditions
 * @summary Find pet by ID
 * @param petId ID of pet that needs to be fetched
 * @param [config] request config
 */
export async function getPetById(petId:
/**
 * @description param ID of pet that needs to be fetched
 * @format int64
 */
number
,config?:AxiosRequestConfig): AxiosPromise<unknown> {
    return axios({
        method: "GET",
        url: `/pet/${petId}`,
...config
    });
}