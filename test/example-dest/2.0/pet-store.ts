/**
 * @title Swagger Petstore
 * @version 1.0.0
 * @contact <apiteam@swagger.io>
 * @description This is a sample server Petstore server.  You can find out more about Swagger at [http://swagger.io](http://swagger.io) or on [irc.freenode.net, #swagger](http://swagger.io/irc/).  For this sample, you can use the api key `special-key` to test the authorization filters.
 */

import type { AxiosPromise, AxiosRequestConfig } from 'axios';
import axios from 'axios';

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

export interface Order {
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
  status?: ('placed' | 'approved' | 'delivered');
  complete?: boolean;
}

export interface Category {
/**
 * @format int64
 */
  id?: number;
  name?: string;
}

export interface User {
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
}

export interface Tag {
/**
 * @format int64
 */
  id?: number;
  name?: string;
}

export interface Pet {
/**
 * @format int64
 */
  id?: number;
  category?: Category;
  /**
   * @example doggie
   */
  name: string;
  photoUrls: Array<string>;
  tags?: Array<Tag>;
  /**
   * @description pet status in the store
   */
  status?: ('available' | 'pending' | 'sold');
}

export interface ApiResponse {
/**
 * @format int32
 */
  code?: number;
  type?: string;
  message?: string;
}

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
    url: `/pet`,
    data,
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
    url: `/pet`,
    data,
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
export async function findPetsByStatus(status: Array<
/**
 * @default available
 */
  ('available' | 'pending' | 'sold')
>, config?: AxiosRequestConfig): AxiosPromise<Array<Pet>> {
  return axios({
    method: 'get',
    url: `/pet/findByStatus`,
    params: { status },
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
export async function findPetsByTags(tags: Array<string>, config?: AxiosRequestConfig): AxiosPromise<Array<Pet>> {
  return axios({
    method: 'get',
    url: `/pet/findByTags`,
    params: { tags },
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
    url: `/pet/${petId}`,
    ...config,
  });
}

/**
 * @description
 * @summary Updates a pet in the store with form data
 * @see pet Everything about your Pets {@link http://swagger.io Find out more}
 * @param petId ID of pet that needs to be updated
 * @param data request data
 * @param [config] request config
 */
export async function updatePetWithForm(petId: number, data: {
/**
 * @description Updated name of the pet
 */
  name?: string;
  /**
   * @description Updated status of the pet
   */
  status?: string;
}, config?: AxiosRequestConfig): AxiosPromise<unknown> {
  return axios({
    method: 'post',
    url: `/pet/${petId}`,
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
    url: `/pet/${petId}`,
    headers: { api_key: apiKey },
    ...config,
  });
}

/**
 * @description
 * @summary uploads an image
 * @see pet Everything about your Pets {@link http://swagger.io Find out more}
 * @param petId ID of pet to update
 * @param data request data
 * @param [config] request config
 * @returns successful operation
 */
export async function uploadFile(petId: number, data: {
/**
 * @description Additional data to pass to server
 */
  additionalMetadata?: string;
  /**
   * @description file to upload
   * @format binary
   */
  file?: Blob;
}, config?: AxiosRequestConfig): AxiosPromise<ApiResponse> {
  return axios({
    method: 'post',
    url: `/pet/${petId}/uploadImage`,
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
    url: `/store/inventory`,
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
    url: `/store/order`,
    data,
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
    url: `/store/order/${orderId}`,
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
    url: `/store/order/${orderId}`,
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
    url: `/user`,
    data,
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
export async function createUsersWithArrayInput(data: Array<User>, config?: AxiosRequestConfig): AxiosPromise<unknown> {
  return axios({
    method: 'post',
    url: `/user/createWithArray`,
    data,
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
export async function createUsersWithListInput(data: Array<User>, config?: AxiosRequestConfig): AxiosPromise<unknown> {
  return axios({
    method: 'post',
    url: `/user/createWithList`,
    data,
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
export async function loginUser(params: {
/**
 * @description The user name for login
 */
  username: string;
  /**
   * @description The password for login in clear text
   */
  password: string;
}, config?: AxiosRequestConfig): AxiosPromise<string> {
  return axios({
    method: 'get',
    url: `/user/login`,
    params,
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
    url: `/user/logout`,
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
    url: `/user/${username}`,
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
    url: `/user/${username}`,
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
    url: `/user/${username}`,
    data,
    ...config,
  });
}
