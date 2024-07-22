/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * @title Swagger Petstore - OpenAPI 3.1
 * @version 1.0.6
 * @contact <apiteam@swagger.io>
 * @description This is a sample Pet Store Server based on the OpenAPI 3.1 specification.
You can find out more about
Swagger at [http://swagger.io](http://swagger.io).
 * @summary Pet Store 3.1
 * @see {@link http://swagger.io Find out more about Swagger}
 */

import axios from "axios";
import type {AxiosRequestConfig, AxiosPromise} from "axios";
import type {OneOf, AllOf, AnyOf, AnyObject, AnyArray} from "pkg-name-for-test/client";
import {resolveURL} from "pkg-name-for-test/client";

const BASE_URL="/api/v31";

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
"photoUrls":((string)[]);
"tags"?:((unknown)[]);
/**
 * @description pet status in the store
 */
"status"?:("available"|"pending"|"sold");
/**
 * @format int32
 * @example 7
 */
"availableInstances"?:number;
"petDetailsId"?:unknown;
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
export async function updatePet(data:Pet,config?:AxiosRequestConfig): AxiosPromise<Pet> {
    return axios({
        method: "put",
        data,
url: resolveURL(BASE_URL,"/pet"),
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
export async function addPet(data:Pet,config?:AxiosRequestConfig): AxiosPromise<Pet> {
    return axios({
        method: "post",
        data,
url: resolveURL(BASE_URL,"/pet"),
...config
    });
}

/**
 * @description Returns a pet when 0 < ID <= 10.  ID > 10 or nonintegers will simulate API error conditions
 * @summary Find pet by ID
 * @param petId ID of pet that needs to be fetched
 * @param [config] request config
 */
export async function getPetById(petId:number,config?:AxiosRequestConfig): AxiosPromise<unknown> {
    return axios({
        method: "get",
        url: resolveURL(BASE_URL,"/pet/{petId}",{petId}),
...config
    });
}