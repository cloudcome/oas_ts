/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * @title Swagger Petstore
 * @version 1.0.0
 * @contact <apiteam@swagger.io>
 * @description This is a sample server Petstore server.  You can find out more about Swagger at [http://swagger.io](http://swagger.io) or on [irc.freenode.net, #swagger](http://swagger.io/irc/).  For this sample, you can use the api key `special-key` to test the authorization filters.
 */

import axios from 'axios';
import type { AxiosRequestConfig, AxiosPromise } from 'axios';
import type { OneOf, AllOf, AnyOf, AnyObject, AnyArray } from 'pkg-name-for-test/client';
import { resolveURL } from 'pkg-name-for-test/client';

const BASE_URL = '/';

export type Order = {
    /**
     * @format int64
     */
    id?: number;
    /**
     * @format int64
     */
    petId?: number;
    /**
     * @format int32
     */
    quantity?: number;
    /**
     * @format date-time
     */
    shipDate?: string;
    /**
     * @description Order Status
     */
    status?: 'placed' | 'approved' | 'delivered';
    complete?: boolean;
};

export type Category = {
    /**
     * @format int64
     */
    id?: number;
    name?: string;
};

export type User = {
    /**
     * @format int64
     */
    id?: number;
    username?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    phone?: string;
    /**
     * @description User Status
     * @format int32
     */
    userStatus?: number;
};

export type Tag = {
    /**
     * @format int64
     */
    id?: number;
    name?: string;
};

export type Pet = {
    /**
     * @format int64
     */
    id?: number;
    category?: Category;
    /**
     * @example doggie
     */
    name: string;
    photoUrls: string;
    tags?: Tag;
    /**
     * @description pet status in the store
     */
    status?: 'available' | 'pending' | 'sold';
};

export type ApiResponse = {
    /**
     * @format int32
     */
    code?: number;
    type?: string;
    message?: string;
};

/**
 * @description
 * @summary Add a new pet to the store
 * @see pet Everything about your Pets {@link http://swagger.io Find out more}
 * @param data Pet object that needs to be added to the store
 * @param [config] request config
 */
export async function addPet(data: Pet, config?: AxiosRequestConfig): AxiosPromise<unknown> {
    return axios({
        method: 'post',
        data,
        url: resolveURL(BASE_URL, '/pet'),
        ...config,
    });
}

/**
 * @description
 * @summary Update an existing pet
 * @see pet Everything about your Pets {@link http://swagger.io Find out more}
 * @param data Pet object that needs to be added to the store
 * @param [config] request config
 */
export async function updatePet(data: Pet, config?: AxiosRequestConfig): AxiosPromise<unknown> {
    return axios({
        method: 'put',
        data,
        url: resolveURL(BASE_URL, '/pet'),
        ...config,
    });
}

/**
 * @description Multiple status values can be provided with comma separated strings
 * @summary Finds Pets by status
 * @see pet Everything about your Pets {@link http://swagger.io Find out more}
 * @param status Status values that need to be considered for filter
 * @param [config] request config
 * @returns successful operation
 */
export async function findPetsByStatus(
    status: /**
     * @default available
     */
    'available' | 'pending' | 'sold',
    config?: AxiosRequestConfig,
): AxiosPromise<Pet> {
    return axios({
        method: 'get',
        params: { status },
        url: resolveURL(BASE_URL, '/pet/findByStatus'),
        ...config,
    });
}

/**
 * @deprecated
 * @description Muliple tags can be provided with comma separated strings. Use tag1, tag2, tag3 for testing.
 * @summary Finds Pets by tags
 * @see pet Everything about your Pets {@link http://swagger.io Find out more}
 * @param tags Tags to filter by
 * @param [config] request config
 * @returns successful operation
 */
export async function findPetsByTags(tags: string, config?: AxiosRequestConfig): AxiosPromise<Pet> {
    return axios({
        method: 'get',
        params: { tags },
        url: resolveURL(BASE_URL, '/pet/findByTags'),
        ...config,
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
export async function getPetById(petId: number, config?: AxiosRequestConfig): AxiosPromise<Pet> {
    return axios({
        method: 'get',
        url: resolveURL(BASE_URL, '/pet/{petId}', { petId }),
        ...config,
    });
}

/**
 * @description
 * @summary Updates a pet in the store with form data
 * @see pet Everything about your Pets {@link http://swagger.io Find out more}
 * @param petId ID of pet that needs to be updated
 * @param data request param
 * @param [config] request config
 */
export async function updatePetWithForm(
    petId: number,
    data: {
        /**
         * @description Updated name of the pet
         */
        name?: string;
        /**
         * @description Updated status of the pet
         */
        status?: string;
    },
    config?: AxiosRequestConfig,
): AxiosPromise<unknown> {
    return axios({
        method: 'post',
        url: resolveURL(BASE_URL, '/pet/{petId}', { petId }),
        data,
        ...config,
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
export async function deletePet(petId: number, apiKey?: string, config?: AxiosRequestConfig): AxiosPromise<unknown> {
    return axios({
        method: 'delete',
        url: resolveURL(BASE_URL, '/pet/{petId}', { petId }),
        headers: { api_key: apiKey },
        ...config,
    });
}

/**
 * @description
 * @summary uploads an image
 * @see pet Everything about your Pets {@link http://swagger.io Find out more}
 * @param petId ID of pet to update
 * @param data request param
 * @param [config] request config
 * @returns successful operation
 */
export async function uploadFile(
    petId: number,
    data: {
        /**
         * @description Additional data to pass to server
         */
        additionalMetadata?: string;
        /**
         * @description file to upload
         * @format binary
         */
        file?: string;
    },
    config?: AxiosRequestConfig,
): AxiosPromise<ApiResponse> {
    return axios({
        method: 'post',
        url: resolveURL(BASE_URL, '/pet/{petId}/uploadImage', { petId }),
        data,
        ...config,
    });
}

/**
 * @description Returns a map of status codes to quantities
 * @summary Returns pet inventories by status
 * @see store Access to Petstore orders
 * @param [config] request config
 * @returns successful operation
 */
export async function getInventory(config?: AxiosRequestConfig): AxiosPromise<{
    /**
     * @format int32
     */
    [key: string]: number;
}> {
    return axios({
        method: 'get',
        url: resolveURL(BASE_URL, '/store/inventory'),
        ...config,
    });
}

/**
 * @description
 * @summary Place an order for a pet
 * @see store Access to Petstore orders
 * @param data order placed for purchasing the pet
 * @param [config] request config
 * @returns successful operation
 */
export async function placeOrder(data: Order, config?: AxiosRequestConfig): AxiosPromise<Order> {
    return axios({
        method: 'post',
        data,
        url: resolveURL(BASE_URL, '/store/order'),
        ...config,
    });
}

/**
 * @description For valid response try integer IDs with value >= 1 and <= 10. Other values will generated exceptions
 * @summary Find purchase order by ID
 * @see store Access to Petstore orders
 * @param orderId ID of pet that needs to be fetched
 * @param [config] request config
 * @returns successful operation
 */
export async function getOrderById(orderId: number, config?: AxiosRequestConfig): AxiosPromise<Order> {
    return axios({
        method: 'get',
        url: resolveURL(BASE_URL, '/store/order/{orderId}', { orderId }),
        ...config,
    });
}

/**
 * @description For valid response try integer IDs with positive integer value. Negative or non-integer values will generate API errors
 * @summary Delete purchase order by ID
 * @see store Access to Petstore orders
 * @param orderId ID of the order that needs to be deleted
 * @param [config] request config
 */
export async function deleteOrder(orderId: number, config?: AxiosRequestConfig): AxiosPromise<unknown> {
    return axios({
        method: 'delete',
        url: resolveURL(BASE_URL, '/store/order/{orderId}', { orderId }),
        ...config,
    });
}

/**
 * @description This can only be done by the logged in user.
 * @summary Create user
 * @see user Operations about user {@link http://swagger.io Find out more about our store}
 * @param data Created user object
 * @param [config] request config
 */
export async function createUser(data: User, config?: AxiosRequestConfig): AxiosPromise<unknown> {
    return axios({
        method: 'post',
        data,
        url: resolveURL(BASE_URL, '/user'),
        ...config,
    });
}

/**
 * @description
 * @summary Creates list of users with given input array
 * @see user Operations about user {@link http://swagger.io Find out more about our store}
 * @param data List of user object
 * @param [config] request config
 */
export async function createUsersWithArrayInput(data: User, config?: AxiosRequestConfig): AxiosPromise<unknown> {
    return axios({
        method: 'post',
        data,
        url: resolveURL(BASE_URL, '/user/createWithArray'),
        ...config,
    });
}

/**
 * @description
 * @summary Creates list of users with given input array
 * @see user Operations about user {@link http://swagger.io Find out more about our store}
 * @param data List of user object
 * @param [config] request config
 */
export async function createUsersWithListInput(data: User, config?: AxiosRequestConfig): AxiosPromise<unknown> {
    return axios({
        method: 'post',
        data,
        url: resolveURL(BASE_URL, '/user/createWithList'),
        ...config,
    });
}

/**
 * @description
 * @summary Logs user into the system
 * @see user Operations about user {@link http://swagger.io Find out more about our store}
 * @param params request params
 * @param [config] request config
 * @returns successful operation
 */
export async function loginUser(
    params: {
        /**
         * @description The user name for login
         */
        username: string;
        /**
         * @description The password for login in clear text
         */
        password: string;
    },
    config?: AxiosRequestConfig,
): AxiosPromise<string> {
    return axios({
        method: 'get',
        params,
        url: resolveURL(BASE_URL, '/user/login'),
        ...config,
    });
}

/**
 * @description
 * @summary Logs out current logged in user session
 * @see user Operations about user {@link http://swagger.io Find out more about our store}
 * @param [config] request config
 */
export async function logoutUser(config?: AxiosRequestConfig): AxiosPromise<unknown> {
    return axios({
        method: 'get',
        url: resolveURL(BASE_URL, '/user/logout'),
        ...config,
    });
}

/**
 * @description
 * @summary Get user by user name
 * @see user Operations about user {@link http://swagger.io Find out more about our store}
 * @param username The name that needs to be fetched. Use user1 for testing.
 * @param [config] request config
 * @returns successful operation
 */
export async function getUserByName(username: string, config?: AxiosRequestConfig): AxiosPromise<User> {
    return axios({
        method: 'get',
        url: resolveURL(BASE_URL, '/user/{username}', { username }),
        ...config,
    });
}

/**
 * @description This can only be done by the logged in user.
 * @summary Delete user
 * @see user Operations about user {@link http://swagger.io Find out more about our store}
 * @param username The name that needs to be deleted
 * @param [config] request config
 */
export async function deleteUser(username: string, config?: AxiosRequestConfig): AxiosPromise<unknown> {
    return axios({
        method: 'delete',
        url: resolveURL(BASE_URL, '/user/{username}', { username }),
        ...config,
    });
}

/**
 * @description This can only be done by the logged in user.
 * @summary Updated user
 * @see user Operations about user {@link http://swagger.io Find out more about our store}
 * @param username name that need to be updated
 * @param data Updated user object
 * @param [config] request config
 */
export async function updateUser(username: string, data: User, config?: AxiosRequestConfig): AxiosPromise<unknown> {
    return axios({
        method: 'put',
        url: resolveURL(BASE_URL, '/user/{username}', { username }),
        data,
        ...config,
    });
}
