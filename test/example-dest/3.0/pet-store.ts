/**
 * @title Swagger Petstore - OpenAPI 3.0
 * @version 1.0.19
 * @contact <apiteam@swagger.io>
 * @description This is a sample Pet Store Server based on the OpenAPI 3.0 specification.  You can find out more about
 * Swagger at [http://swagger.io](http://swagger.io). In the third iteration of the pet store, we've switched to the design first approach!
 * You can now help us improve the API whether it's by making changes to the definition itself or to the code.
 * That way, with time, we can improve the API in general, and expose some of the new features in OAS3.
 * 
 * Some useful links:
 * - [The Pet Store repository](https://github.com/swagger-api/swagger-petstore)
 * - [The source API definition for the Pet Store](https://github.com/swagger-api/swagger-petstore/blob/master/src/main/resources/openapi.yaml)
 */

import axios from "axios";
import type {AxiosRequestConfig, AxiosPromise} from "axios";



// helpers --- start
type AnyOf<T extends unknown[]> = T extends [infer A, ...infer B] ? A | AnyOf<B> | (A & AnyOf<B>) : never;
type UnknownObject = Record<string, unknown>;
type DeepGet<O, K> = K extends [infer P, ...infer R]
    ? O extends Record<string, unknown> | Array<unknown>
        ? P extends keyof O
            ? R['length'] extends 0
                ? O[P]
                : DeepGet<NonNullable<O[P]>, R>
            : never
        : never
    : never;
// helpers --- end
    

export type Order = {
/**
 * @format int64
 * @example 10
 */
"id"?:number;
/**
 * @format int64
 * @example 198772
 */
"petId"?:number;
/**
 * @format int32
 * @example 7
 */
"quantity"?:number;
/**
 * @format date-time
 */
"shipDate"?:string;
/**
 * @description Order Status
 * @example approved
 */
"status"?:("placed"|"approved"|"delivered");
"complete"?:boolean;
};

export type Customer = {
/**
 * @format int64
 * @example 100000
 */
"id"?:number;
/**
 * @example fehguy
 */
"username"?:string;
"address"?:Array<Address>;
};

export type Address = {
/**
 * @example 437 Lytton
 */
"street"?:string;
/**
 * @example Palo Alto
 */
"city"?:string;
/**
 * @example CA
 */
"state"?:string;
/**
 * @example 94301
 */
"zip"?:string;
};

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

export type User = {
/**
 * @format int64
 * @example 10
 */
"id"?:number;
/**
 * @example theUser
 */
"username"?:string;
/**
 * @example John
 */
"firstName"?:string;
/**
 * @example James
 */
"lastName"?:string;
/**
 * @example john@email.com
 */
"email"?:string;
/**
 * @example 12345
 */
"password"?:string;
/**
 * @example 12345
 */
"phone"?:string;
/**
 * @description User Status
 * @format int32
 * @example 1
 */
"userStatus"?:number;
};

export type Tag = {
/**
 * @format int64
 */
"id"?:number;
"name"?:string;
};

export type Pet = {
/**
 * @format int64
 * @example 10
 */
"id"?:number;
/**
 * @example doggie
 */
"name":string;
"category"?:Category;
"photoUrls":Array<string>;
"tags"?:Array<Tag>;
/**
 * @description pet status in the store
 */
"status"?:("available"|"pending"|"sold");
};

export type ApiResponse = {
/**
 * @format int32
 */
"code"?:number;
"type"?:string;
"message"?:string;
};

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
        url: `/pet`,
data: data,
...config
    });
}

/**
 * @description Update an existing pet by Id
 * @summary Update an existing pet
 * @see pet Everything about your Pets {@link http://swagger.io Find out more}
 * @param data Update an existent pet in the store
 * @param [config] request config
 * @returns Successful operation
 */
export async function updatePet(data:Pet,config?:AxiosRequestConfig): AxiosPromise<Pet> {
    return axios({
        method: "put",
        url: `/pet`,
data: data,
...config
    });
}

/**
 * @description Multiple status values can be provided with comma separated strings
 * @summary Finds Pets by status
 * @see pet Everything about your Pets {@link http://swagger.io Find out more}
 * @param [status] Status values that need to be considered for filter
 * @param [config] request config
 * @returns successful operation
 */
export async function findPetsByStatus(status?:("available"|"pending"|"sold"),config?:AxiosRequestConfig): AxiosPromise<Array<Pet>> {
    return axios({
        method: "get",
        url: `/pet/findByStatus`,
params: {status: status},
...config
    });
}

/**
 * @description Multiple tags can be provided with comma separated strings. Use tag1, tag2, tag3 for testing.
 * @summary Finds Pets by tags
 * @see pet Everything about your Pets {@link http://swagger.io Find out more}
 * @param [tags] Tags to filter by
 * @param [config] request config
 * @returns successful operation
 */
export async function findPetsByTags(tags?:Array<string>,config?:AxiosRequestConfig): AxiosPromise<Array<Pet>> {
    return axios({
        method: "get",
        url: `/pet/findByTags`,
params: {tags: tags},
...config
    });
}

/**
 * @description Returns a single pet
 * @summary Find pet by ID
 * @see pet Everything about your Pets {@link http://swagger.io Find out more}
 * @param petId ID of pet to return
 * @param [config] request config
 * @returns successful operation
 */
export async function getPetById(petId:number,config?:AxiosRequestConfig): AxiosPromise<Pet> {
    return axios({
        method: "get",
        url: `/pet/${petId}`,
...config
    });
}

/**
 * @description 
 * @summary Updates a pet in the store with form data
 * @see pet Everything about your Pets {@link http://swagger.io Find out more}
 * @param petId ID of pet that needs to be updated
 * @param [params] request params
 * @param [config] request config
 */
export async function updatePetWithForm(petId:number,params?:{
/**
 * @description Name of pet that needs to be updated
 */
"name"?:string;
/**
 * @description Status of pet that needs to be updated
 */
"status"?:string;
},config?:AxiosRequestConfig): AxiosPromise<unknown> {
    return axios({
        method: "post",
        url: `/pet/${petId}`,
params: params,
...config
    });
}

/**
 * @description 
 * @summary Deletes a pet
 * @see pet Everything about your Pets {@link http://swagger.io Find out more}
 * @param petId Pet id to delete
 * @param [apiKey] request param
 * @param [config] request config
 */
export async function deletePet(petId:number,apiKey?:string,config?:AxiosRequestConfig): AxiosPromise<unknown> {
    return axios({
        method: "delete",
        url: `/pet/${petId}`,
headers: {api_key: apiKey},
...config
    });
}

/**
 * @description 
 * @summary uploads an image
 * @see pet Everything about your Pets {@link http://swagger.io Find out more}
 * @param petId ID of pet to update
 * @param data request data
 * @param [additionalMetadata] Additional Metadata
 * @param [config] request config
 * @returns successful operation
 */
export async function uploadFile(petId:number,data:Blob,additionalMetadata?:string,config?:AxiosRequestConfig): AxiosPromise<ApiResponse> {
    return axios({
        method: "post",
        url: `/pet/${petId}/uploadImage`,
data: data,
params: {additionalMetadata: additionalMetadata},
...config
    });
}

/**
 * @description Returns a map of status codes to quantities
 * @summary Returns pet inventories by status
 * @see store Access to Petstore orders {@link http://swagger.io Find out more about our store}
 * @param [config] request config
 * @returns successful operation
 */
export async function getInventory(config?:AxiosRequestConfig): AxiosPromise<{
/**
 * @format int32
 */
[key: string]:number;
}> {
    return axios({
        method: "get",
        url: `/store/inventory`,
...config
    });
}

/**
 * @description Place a new order in the store
 * @summary Place an order for a pet
 * @see store Access to Petstore orders {@link http://swagger.io Find out more about our store}
 * @param data request data
 * @param [config] request config
 * @returns successful operation
 */
export async function placeOrder(data:Order,config?:AxiosRequestConfig): AxiosPromise<Order> {
    return axios({
        method: "post",
        url: `/store/order`,
data: data,
...config
    });
}

/**
 * @description For valid response try integer IDs with value <= 5 or > 10. Other values will generate exceptions.
 * @summary Find purchase order by ID
 * @see store Access to Petstore orders {@link http://swagger.io Find out more about our store}
 * @param orderId ID of order that needs to be fetched
 * @param [config] request config
 * @returns successful operation
 */
export async function getOrderById(orderId:number,config?:AxiosRequestConfig): AxiosPromise<Order> {
    return axios({
        method: "get",
        url: `/store/order/${orderId}`,
...config
    });
}

/**
 * @description For valid response try integer IDs with value < 1000. Anything above 1000 or nonintegers will generate API errors
 * @summary Delete purchase order by ID
 * @see store Access to Petstore orders {@link http://swagger.io Find out more about our store}
 * @param orderId ID of the order that needs to be deleted
 * @param [config] request config
 */
export async function deleteOrder(orderId:number,config?:AxiosRequestConfig): AxiosPromise<unknown> {
    return axios({
        method: "delete",
        url: `/store/order/${orderId}`,
...config
    });
}

/**
 * @description This can only be done by the logged in user.
 * @summary Create user
 * @see user Operations about user
 * @param data Created user object
 * @param [config] request config
 */
export async function createUser(data:User,config?:AxiosRequestConfig): AxiosPromise<unknown> {
    return axios({
        method: "post",
        url: `/user`,
data: data,
...config
    });
}

/**
 * @description Creates list of users with given input array
 * @summary Creates list of users with given input array
 * @see user Operations about user
 * @param data request data
 * @param [config] request config
 * @returns Successful operation
 */
export async function createUsersWithListInput(data:Array<User>,config?:AxiosRequestConfig): AxiosPromise<User> {
    return axios({
        method: "post",
        url: `/user/createWithList`,
data: data,
...config
    });
}

/**
 * @description 
 * @summary Logs user into the system
 * @see user Operations about user
 * @param [params] request params
 * @param [config] request config
 * @returns successful operation
 */
export async function loginUser(params?:{
/**
 * @description The user name for login
 */
"username"?:string;
/**
 * @description The password for login in clear text
 */
"password"?:string;
},config?:AxiosRequestConfig): AxiosPromise<string> {
    return axios({
        method: "get",
        url: `/user/login`,
params: params,
...config
    });
}

/**
 * @description 
 * @summary Logs out current logged in user session
 * @see user Operations about user
 * @param [config] request config
 */
export async function logoutUser(config?:AxiosRequestConfig): AxiosPromise<unknown> {
    return axios({
        method: "get",
        url: `/user/logout`,
...config
    });
}

/**
 * @description 
 * @summary Get user by user name
 * @see user Operations about user
 * @param username The name that needs to be fetched. Use user1 for testing. 
 * @param [config] request config
 * @returns successful operation
 */
export async function getUserByName(username:string,config?:AxiosRequestConfig): AxiosPromise<User> {
    return axios({
        method: "get",
        url: `/user/${username}`,
...config
    });
}

/**
 * @description This can only be done by the logged in user.
 * @summary Delete user
 * @see user Operations about user
 * @param username The name that needs to be deleted
 * @param [config] request config
 */
export async function deleteUser(username:string,config?:AxiosRequestConfig): AxiosPromise<unknown> {
    return axios({
        method: "delete",
        url: `/user/${username}`,
...config
    });
}

/**
 * @description This can only be done by the logged in user.
 * @summary Update user
 * @see user Operations about user
 * @param username name that needs to be updated
 * @param data Update an existent user in the store
 * @param [config] request config
 */
export async function updateUser(username:string,data:User,config?:AxiosRequestConfig): AxiosPromise<unknown> {
    return axios({
        method: "put",
        url: `/user/${username}`,
data: data,
...config
    });
}