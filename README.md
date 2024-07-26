# openapi-axios

OpenAPI → Axios

[![code-review](https://github.com/FrontEndDev-org/openapi-axios/actions/workflows/code-review.yml/badge.svg)](https://github.com/FrontEndDev-org/openapi-axios/actions/workflows/code-review.yml)
[![dependency-review](https://github.com/FrontEndDev-org/openapi-axios/actions/workflows/dependency-review.yml/badge.svg)](https://github.com/FrontEndDev-org/openapi-axios/actions/workflows/dependency-review.yml)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/4fa1acaeb717469caddfe21a84c50bb2)](https://app.codacy.com/gh/FrontEndDev-org/openapi-axios/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Codacy Badge](https://app.codacy.com/project/badge/Coverage/4fa1acaeb717469caddfe21a84c50bb2)](https://app.codacy.com/gh/FrontEndDev-org/openapi-axios/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_coverage)
[![npm version](https://badge.fury.io/js/openapi-axios.svg)](https://npmjs.com/package/openapi-axios)

将 OpenAPI 规范声明文件转换为类型声明和可执行函数（基于 Axios）。与其他同类工具相比，具有以下特点：

- 😆 支持 [openAPI](https://www.openapis.org/) v3.x 规范
- 😉 生成的每个 API 都是一个函数，用于在构建时轻松进行 tree shaking
- 😎 与最流行的 HTTP 客户端 [axios](https://axios-http.com/) 进行适配
- 🤗 轻松与本地请求客户端集成，例如在本地项目中创建的 Axios 实例（通常我们在本地都是需要自定义一些拦截器什么的）
- 😁 易于使用，易于学习，类型安全

# 安装

```shell
npm i -D openapi-axios@latest
npm i axios
```

# 使用

## 创建配置文件
```shell
npx openapi-axios init
```
将在项目根目录下创建配置文件 openapi.config.cjs：
```js
const { defineConfig } = require('openapi-axios');

/**
 * openapi-axios config
 * @ref https://github.com/FrontEndDev-org/openapi-axios
 */
module.exports = defineConfig({
    modules: {
        'petStore3': 'https://petstore31.swagger.io/api/v31/openapi.json'
    },
});
```

## 生成 API 文件
```shell
# 根据配置文件生成typescript文件
npx openapi-axios

# 将会生成 src/apis/petStore3.ts 文件
```

<details>
<summary>【点击展开】生成的文件将导出为一个函数和一个操作，如下所示</summary>

```ts
/**
 * @module petStore3
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
import type { AxiosRequestConfig, AxiosPromise } from "axios";
import { resolveURL } from "openapi-axios/client";
import type { OneOf } from "openapi-axios/client";

const BASE_URL = "/api/v31";

// ... 省略 ...

/**
 * @description Pet
 */
export type Pet = {
    /**
     * @format int64
     * @example 10
     */
    id?: number;
    /**
     * @description Pet Category
     */
    category?: unknown;
    /**
     * @example doggie
     */
    name: string;
    photoUrls: ((string)[]);
    tags?: ((unknown)[]);
    /**
     * @description pet status in the store
     */
    status?: ("available" | "pending" | "sold");
    /**
     * @format int32
     * @example 7
     */
    availableInstances?: number;
    petDetailsId?: unknown;
    petDetails?: PetDetails;
};

// ... 省略 ...

/**
 * @module petStore3
 * @description Update an existing pet by Id
 * @summary Update an existing pet
 * @see pet Everything about your Pets {@link http://swagger.io Find out more}
 * @param data Pet object that needs to be updated in the store
 * @param [config] request config
 * @returns Successful operation
 */
export async function updatePet(data: Pet, config?: AxiosRequestConfig): AxiosPromise<Pet> {
    return axios({
        method: "put",
        data: data,
        url: resolveURL(BASE_URL, "/pet"),
        ...config
    });
}

// ... 省略 ...
```
</details>

然后你可以直接导入一个函数并使用它。 调用接口就像调用本地函数一样简单。

```ts
import { updatePet } from '@/apis/petStore3';

// 类型安全
const { data: pet } = await updatePet({
  name: 'MyCat',
  photoUrls: ['photo1', 'photo2']
});

// 类型安全
console.log(pet);
```


