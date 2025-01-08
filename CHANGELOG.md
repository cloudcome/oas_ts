# Changelog

## [0.28.1](https://github.com/FrontEndDev-org/openapi-axios/compare/v0.28.0...v0.28.1) (2025-01-08)


### Bug Fixes

* 修复指定导入文件后未正确输出 ([345e4b2](https://github.com/FrontEndDev-org/openapi-axios/commit/345e4b276bd9d6c0058ff16a0e410475b25d3852))

## [0.28.0](https://github.com/FrontEndDev-org/openapi-axios/compare/v0.27.0...v0.28.0) (2025-01-03)


### Features

* 关键字字典调整 ([fa7dfff](https://github.com/FrontEndDev-org/openapi-axios/commit/fa7dffff1d2efd9f705ab27442e396468ff12699))

## [0.27.0](https://github.com/FrontEndDev-org/openapi-axios/compare/v0.26.1...v0.27.0) (2025-01-03)


### Features

* axiosImportName 选项默认值调整为 "" ([2364378](https://github.com/FrontEndDev-org/openapi-axios/commit/236437897794c483ea2e98d58e3317956a73c343))

## [0.26.1](https://github.com/FrontEndDev-org/openapi-axios/compare/v0.26.0...v0.26.1) (2025-01-03)


### Bug Fixes

* 修复 path arg 属性名 ([3f82434](https://github.com/FrontEndDev-org/openapi-axios/commit/3f8243432831a7dae7bf7a47918bfb9b2fcab931))

## [0.26.0](https://github.com/FrontEndDev-org/openapi-axios/compare/v0.25.1...v0.26.0) (2025-01-03)


### Features

* axios 导入名称配置优化 ([a3ba8d1](https://github.com/FrontEndDev-org/openapi-axios/commit/a3ba8d1cc4c282a5009c5e83c3dc1b9725256521))
* 支持指定 axios 类型导入文件 ([039d16d](https://github.com/FrontEndDev-org/openapi-axios/commit/039d16d90f856833fb9fe5c48dbd76755d92fe20))
* 生成头尾部选项修正 ([c353038](https://github.com/FrontEndDev-org/openapi-axios/commit/c353038f9a55571d0d0303675b38a7268b9c84cb))
* 配置文件名修改为 openapi-axios.config ([c10a182](https://github.com/FrontEndDev-org/openapi-axios/commit/c10a1824124faff488eb1f9adb4a179e169324c3))

## [0.25.1](https://github.com/FrontEndDev-org/openapi-axios/compare/v0.25.0...v0.25.1) (2024-12-31)


### Bug Fixes

* 修正请求参数名称为非 JS 变量时字符化 ([60125a1](https://github.com/FrontEndDev-org/openapi-axios/commit/60125a129d6e012b6641831c0814773d06db4752))

## [0.25.0](https://github.com/FrontEndDev-org/openapi-axios/compare/v0.24.0...v0.25.0) (2024-08-05)


### Features

* 优化 jsDoc 多行显示 ([adfdfdd](https://github.com/FrontEndDev-org/openapi-axios/commit/adfdfdd5608c898cdd407262d3d845120d083c2b))
* 增加 typeScript 内置类型唯一性 ([ffd42b3](https://github.com/FrontEndDev-org/openapi-axios/commit/ffd42b3dd3b78751d2718c86947db2b351bc831d))
* 忽略未明确的 path 参数 ([29312cc](https://github.com/FrontEndDev-org/openapi-axios/commit/29312cce5f1bd9016f3fe2d42f79f5788c7adb5a))
* 支持 ref.$anchor ([aef3726](https://github.com/FrontEndDev-org/openapi-axios/commit/aef37261fbd1a94c7aedc097e8870d0ee07174f8))
* 支持 ref.$id ([1c0896a](https://github.com/FrontEndDev-org/openapi-axios/commit/1c0896a4072eabd195860a4d8094864188e15ad9))


### Bug Fixes

* 优化下一个唯一变量生成方法 ([cc83da4](https://github.com/FrontEndDev-org/openapi-axios/commit/cc83da452ba632e2af7e437d104edd91d6249c0d))
* 修复 UnknownObject ([6959961](https://github.com/FrontEndDev-org/openapi-axios/commit/695996101a652981f55ffffb0b4bd41def37ac96))
* 修正 nullable 的升级兼容 ([c565fdc](https://github.com/FrontEndDev-org/openapi-axios/commit/c565fdc82f57dce0210b604a29b74ddf20556ff9))
* 唯一变量与唯一类型区分 ([799b459](https://github.com/FrontEndDev-org/openapi-axios/commit/799b45932064b87fb3b077364c8144131e1339b4))
* 新增内部类型 UnknownObject UnknownArray ([d7594cd](https://github.com/FrontEndDev-org/openapi-axios/commit/d7594cd69622d2ab3f4eed654834841a99704bd1))

## [0.24.0](https://github.com/FrontEndDev-org/openapi-axios/compare/v0.23.0...v0.24.0) (2024-08-01)


### Features

* schema 继承 parameter 内 deprecated 属性 ([7720655](https://github.com/FrontEndDev-org/openapi-axios/commit/7720655fd47da49e4fed061810d77379fdfd80b2))
* 内置 helpers，避免从外部导入 ([d30f674](https://github.com/FrontEndDev-org/openapi-axios/commit/d30f6746363b758b8c3e13fe8806040d73074bb6))
* 去除 resolveURL helper ([cb09b9f](https://github.com/FrontEndDev-org/openapi-axios/commit/cb09b9fc406ae1bf2aab9ef51a232edd293a9269))
* 去除不必要的配置 baseURL ([df0c7d2](https://github.com/FrontEndDev-org/openapi-axios/commit/df0c7d2aa3ef9b317c899b464aec56eb6077f65c))
* 增加 openapi2.0、3.0、3.1 全类型 ([464e90a](https://github.com/FrontEndDev-org/openapi-axios/commit/464e90a4eb0cdb2eff7d5b2f60a7ffc866f17d0a))
* 支持 openapi 2.0 逐级迁移到 3.1 ([0071649](https://github.com/FrontEndDev-org/openapi-axios/commit/00716498fb47cc6c8d2b29bad6b011a947b21ea4))
* 支持了 format=binary ([f6235df](https://github.com/FrontEndDev-org/openapi-axios/commit/f6235df723400b744101f4ce4810299912237bd5))
* 支持修订后的数据代码生成 ([a23e611](https://github.com/FrontEndDev-org/openapi-axios/commit/a23e611d59dbb269e0bea78650ccb60a46397ebd))
* 支持读取 openapi json 时迁移到最新版本后进入后续解析流程 ([59cb368](https://github.com/FrontEndDev-org/openapi-axios/commit/59cb368d40215f0861fce82332687679722de85f))
* 调整 parameter 顺序 path &gt; query ([e6667d5](https://github.com/FrontEndDev-org/openapi-axios/commit/e6667d50fdc253a959fcb8a7bde204dbcd0f3f79))


### Bug Fixes

* 修正 request param 和 request data 的注释 ([ddeb80a](https://github.com/FrontEndDev-org/openapi-axios/commit/ddeb80a20cb638153b5f8777a5bec751487a9113))

## [0.23.0](https://github.com/FrontEndDev-org/openapi-axios/compare/v0.22.0...v0.23.0) (2024-07-26)


### Features

* **printer:** 添加文件头尾信息配置项 ([7ef510e](https://github.com/FrontEndDev-org/openapi-axios/commit/7ef510ed3b75557a694058d332a3160fb807cae9))

## [0.22.0](https://github.com/FrontEndDev-org/openapi-axios/compare/openapi-axios-v0.21.0...openapi-axios-v0.22.0) (2024-07-26)


### Features

* **release-please-config:** remove release-as version specification ([eeef20d](https://github.com/FrontEndDev-org/openapi-axios/commit/eeef20d5cb7b0ca8df285e09f121f0f5d81c12e3))
* 指定版本 0.0.1 ([f39d2a9](https://github.com/FrontEndDev-org/openapi-axios/commit/f39d2a96a33b19154370b51fd7ab2079c9a3e96a))


### Bug Fixes

* 修正构建目录结构嵌套 ([96951f8](https://github.com/FrontEndDev-org/openapi-axios/commit/96951f85e84480ac720cc372d522795ead5813c2))

## [0.21.0](https://github.com/FrontEndDev-org/openapi-axios/compare/v0.20.0...v0.21.0) (2024-07-22)


### Features

* 丰富命令行操作 ([b6925ca](https://github.com/FrontEndDev-org/openapi-axios/commit/b6925ca1e57f7748ce81bba989c5d9de56d31a1f))


### Bug Fixes

* 修正 ref 可选性判断 ([8222d04](https://github.com/FrontEndDev-org/openapi-axios/commit/8222d045fa9bba4171267a096b4c59e64c7e28bf))
* 修正请求参数键名错误的问题 ([31ebf30](https://github.com/FrontEndDev-org/openapi-axios/commit/31ebf30cea602638d1049fa9de5dc74c896d4a7b))

## [0.20.0](https://github.com/FrontEndDev-org/openapi-axios/compare/v0.19.1...v0.20.0) (2024-07-19)


### Features

* **printer:** 添加新导入类型以支持更丰富的模式 ([6c9f9cd](https://github.com/FrontEndDev-org/openapi-axios/commit/6c9f9cdb6965a08617b9d331991b23a156b7d090))
* 支持 additionalProperties ([a749471](https://github.com/FrontEndDev-org/openapi-axios/commit/a7494719787f30e1f7b63f3f5f6b93106461e406))
* 支持泛型对象 ([2a587da](https://github.com/FrontEndDev-org/openapi-axios/commit/2a587daa398a9bc60c320ccc295f34190006480f))


### Bug Fixes

* **printer:** 处理非基本类型格式的JS文档注释 ([4dff5e9](https://github.com/FrontEndDev-org/openapi-axios/commit/4dff5e91cc8cb1c6b8eac9856461119990f96a3e))

## [0.19.1](https://github.com/FrontEndDev-org/openapi-axios/compare/v0.19.0...v0.19.1) (2024-07-15)


### Bug Fixes

* 优化对 openapi 标识符的判断 ([6ad5541](https://github.com/FrontEndDev-org/openapi-axios/commit/6ad5541a89859a6e98c434e4d5dd491e751d4a64))
* 优化生成注释顺序 ([694ac7f](https://github.com/FrontEndDev-org/openapi-axios/commit/694ac7fd3a5b139b7b1fd5d7f60c8c8c5b62a49f))
* 修正 axiosImportFile 导入路径 ([558ef68](https://github.com/FrontEndDev-org/openapi-axios/commit/558ef68ac9af577685ea67887e162f13ca5fb95c))
* 修正路径相对计算 ([72d4934](https://github.com/FrontEndDev-org/openapi-axios/commit/72d4934714f0585df544dce078c4e436b943c591))

## [0.19.0](https://github.com/FrontEndDev-org/openapi-axios/compare/v0.18.1...v0.19.0) (2024-07-03)


### Features

* 打印时增加 module 信息输出 ([235e4d6](https://github.com/FrontEndDev-org/openapi-axios/commit/235e4d6b4d60d6fec0f91b07589a44d2eabe0618))
* 配置项由 openAPIs 数组调整为 modules 对象 ([47c638c](https://github.com/FrontEndDev-org/openapi-axios/commit/47c638cb3ac13eb69da90057fc57090960de3830))

## [0.18.1](https://github.com/FrontEndDev-org/openapi-axios/compare/v0.18.0...v0.18.1) (2024-05-24)


### Bug Fixes

* 修正未处理 nullable 的问题 ([3987e10](https://github.com/FrontEndDev-org/openapi-axios/commit/3987e10e8e88875b9b4b96243698405651f85b95))

## [0.18.0](https://github.com/FrontEndDev-org/openapi-axios/compare/v0.17.3...v0.18.0) (2024-04-23)


### Features

* 支持请求、响应、参数的引用 ([cbe6cc1](https://github.com/FrontEndDev-org/openapi-axios/commit/cbe6cc1939aa56ae43daefe6e2a49e05fb8d0bf8))

## [0.17.3](https://github.com/FrontEndDev-org/openapi-axios/compare/v0.17.2...v0.17.3) (2024-04-16)


### Bug Fixes

* 修复 release-please 工作流 ([80c873c](https://github.com/FrontEndDev-org/openapi-axios/commit/80c873ca835a9db618134ec518f89e8e530a7403))

## [0.17.2](https://github.com/FrontEndDev-org/openapi-axios/compare/v0.17.1...v0.17.2) (2024-04-16)


### Bug Fixes

* 修正未考虑属性自身必填的情况 ([569c817](https://github.com/FrontEndDev-org/openapi-axios/commit/569c817ca400b92a7cf19e18e7a5af3d89c8c250))

## [0.17.1](https://github.com/FrontEndDev-org/openapi-axios/compare/v0.17.0...v0.17.1) (2024-01-23)


### Bug Fixes

* 修复发布 npm 包 provenance 的问题 ([9175e80](https://github.com/FrontEndDev-org/openapi-axios/commit/9175e802cb0582713bbd47280a09eddfc811c016))

## [0.17.0](https://github.com/FrontEndDev-org/openapi-axios/compare/v0.16.0...v0.17.0) (2024-01-23)


### Features

* axiosImport 修改为 axiosImportPath ([710e968](https://github.com/FrontEndDev-org/openapi-axios/commit/710e9687371f96f77334320eef56970dd2e571e9))
* 去除 prettier 相关配置，由外置应用工程自行格式化 ([506383f](https://github.com/FrontEndDev-org/openapi-axios/commit/506383f6a9f27ca390e9155836f881a464a49a77))


### Bug Fixes

* 修正在 webstorm 里导入二级目录报错的问题 ([d35e8a4](https://github.com/FrontEndDev-org/openapi-axios/commit/d35e8a4c09e3fe5de74841a128b511a2bc09d52a))

## [0.16.0](https://github.com/FrontEndDev-org/openapi-axios/compare/v0.15.3...v0.16.0) (2023-06-19)


### Features

* **parser:** 新增nameFormatter支持自定义方法名 Implement [#247](https://github.com/FrontEndDev-org/openapi-axios/issues/247) ([28e64d7](https://github.com/FrontEndDev-org/openapi-axios/commit/28e64d716f19ff810ccecae705bccb3f8b1fcdfd))


### Bug Fixes

* **parser:** nameFormatter 入参改为对象 ([9eab1e3](https://github.com/FrontEndDev-org/openapi-axios/commit/9eab1e37d98048786f1d2c380d0ad55f8915d522))

## [0.15.3](https://github.com/FrontEndDev-org/openapi-axios/compare/v0.15.2...v0.15.3) (2023-06-15)


### Bug Fixes

* 修复未对 JS 保留字的命名保护 ([64d9c36](https://github.com/FrontEndDev-org/openapi-axios/commit/64d9c3662a913af60316eccd23e9ec6ac42ac94f))

## [0.15.2](https://github.com/FrontEndDev-org/openapi-axios/compare/v0.15.1...v0.15.2) (2023-06-15)


### Bug Fixes

* 修复 process 模块的 cjs 与 esm 互操作错误的问题 ([cdc0990](https://github.com/FrontEndDev-org/openapi-axios/commit/cdc099091275c640d7df2b4ab4b7375e1c61dfdd)), closes [#238](https://github.com/FrontEndDev-org/openapi-axios/issues/238)

## [0.15.1](https://github.com/FrontEndDev-org/openapi-axios/compare/v0.15.0...v0.15.1) (2023-05-10)


### Bug Fixes

* **printer:** 修正 axios 的导入 ([61c5b17](https://github.com/FrontEndDev-org/openapi-axios/commit/61c5b17cae8531375e7ab7a520824ed6bb282b0b))

## [0.15.0](https://github.com/FrontEndDev-org/openapi-axios/compare/v0.14.0...v0.15.0) (2023-04-24)


### Features

* helpers 增加版本号输出 ([afbade6](https://github.com/FrontEndDev-org/openapi-axios/commit/afbade6f6955d0b9a6756b72dfa1f3edc3515e88))

## [0.14.0](https://github.com/FrontEndDev-org/openapi-axios/compare/v0.13.0...v0.14.0) (2023-04-18)


### Features

* 兼容支持 node&gt;=14.21 ([42f0e63](https://github.com/FrontEndDev-org/openapi-axios/commit/42f0e63e0653610937b565405d61e3648bb42a02))

## [0.13.0](https://github.com/FrontEndDev-org/openapi-axios/compare/v0.12.0...v0.13.0) (2023-04-16)


### Features

* **generator:** 事件系统 ([67f14bb](https://github.com/FrontEndDev-org/openapi-axios/commit/67f14bbe1f2bcc89e68a1cb85370f93b96cccd62))
* **generator:** 命令行支持 ([90366cb](https://github.com/FrontEndDev-org/openapi-axios/commit/90366cb8f738a1f716e79185b0ec15ec13163094))
* **generator:** 支持配置文件的查找和解析 ([bd365a8](https://github.com/FrontEndDev-org/openapi-axios/commit/bd365a880800060658ba85de0ec5eb9d79f73d4f))
* **generator:** 日志打印系统 ([2715bb0](https://github.com/FrontEndDev-org/openapi-axios/commit/2715bb0e4127133cc8c61179bda7c3b872333f15))
* **helpers:** 只保留 resolveURL ([e88cb4b](https://github.com/FrontEndDev-org/openapi-axios/commit/e88cb4bad1b4c917bfdfc6bdcc9cec5f6235c88c))
* **parser:** components 部分别名解析优化 ([9af433f](https://github.com/FrontEndDev-org/openapi-axios/commit/9af433f4885f91a73630cd06c3deed53a2964e84))
* **parser:** components 部分解析 ([7a2f5b0](https://github.com/FrontEndDev-org/openapi-axios/commit/7a2f5b078bcc1996e9cbedeb817366466e4b72ea))
* **parser:** paths 参数解析 ([c6fdd7f](https://github.com/FrontEndDev-org/openapi-axios/commit/c6fdd7fc890fa73940c3efd67b9fe6f7b5257d9c))
* **parser:** paths 部分解析 ([3f7e379](https://github.com/FrontEndDev-org/openapi-axios/commit/3f7e37922a50663b4fe4b762f8c0e6f77e1fa575))
* **parser:** type 和 operation 命名规则 ([83b24ef](https://github.com/FrontEndDev-org/openapi-axios/commit/83b24efc3e5efbbfa764bc8bf81dd85ea83f0e9a))
* **parser:** 基础解析 ([c91ba35](https://github.com/FrontEndDev-org/openapi-axios/commit/c91ba35b8493c6bb4249650134a1f11f0c213af4))
* **parser:** 增加 DocumentParser ([05de46e](https://github.com/FrontEndDev-org/openapi-axios/commit/05de46e4f7d8b8fd7bfd0074ba3ab277be63b268))
* **parser:** 类型、常量定义 ([0d0c626](https://github.com/FrontEndDev-org/openapi-axios/commit/0d0c62610d6315d4e03e501c2d465a88fa872229))
* **reader:** 优化对 operation 参数可选性解读 ([defca29](https://github.com/FrontEndDev-org/openapi-axios/commit/defca291dfea1142858429ccf2a4de9af175fd8e))
* **reader:** 优化请求的 path/query 的类型结构 ([b70ffd7](https://github.com/FrontEndDev-org/openapi-axios/commit/b70ffd7f53815ff73a326f953cfc398173dac86d))
* **reader:** 增加请求/响应类型名称定义选项 ([7aa1087](https://github.com/FrontEndDev-org/openapi-axios/commit/7aa1087f0ecb64a2888c4d82f0fd4af4acccf1af))
* **reader:** 支持 additionalProperties 解读 ([fe4eeb6](https://github.com/FrontEndDev-org/openapi-axios/commit/fe4eeb675afdd18482a8b9bf53b787dc82551e55))
* **reader:** 支持 Blob 类型解读 ([9d00a15](https://github.com/FrontEndDev-org/openapi-axios/commit/9d00a157267af7f5f4f81315bbf03239f55c3e7f))
* **reader:** 支持自定义请求/响应类型名称定义选项 ([771c81c](https://github.com/FrontEndDev-org/openapi-axios/commit/771c81c3581870ef8cd56ce8cb1b891d8db6c1d0))
* ref 路径解析 ([9ecd29f](https://github.com/FrontEndDev-org/openapi-axios/commit/9ecd29f8874526bade70363abbbc84d19ee8d06e))
* **utils:** 优化 varString ([16b997d](https://github.com/FrontEndDev-org/openapi-axios/commit/16b997dcbb5635a591d312a6defcf383bb680674))
* **utils:** 优化 varString 变量处理 ([7ef45b0](https://github.com/FrontEndDev-org/openapi-axios/commit/7ef45b0b49dc1b0ea030f7ea86c1f96e04e2d131))
* **utils:** 新增 joinSlices ([59ac1d8](https://github.com/FrontEndDev-org/openapi-axios/commit/59ac1d8562d09e295760aec439b157491c085a32))
* **utils:** 新增 nextUniqueName ([f62c3ec](https://github.com/FrontEndDev-org/openapi-axios/commit/f62c3ec300d2ed5f01602e5fbc154039aa728ec7))
* **writer:** 增加 comments writer ([05fffd2](https://github.com/FrontEndDev-org/openapi-axios/commit/05fffd26ff4684362c168328f913a63797a5e953))
* **writer:** 增加 components writer ([6ca3a71](https://github.com/FrontEndDev-org/openapi-axios/commit/6ca3a71cc70c73962bef835104cb33d169cd9566))
* **writer:** 增加 paths writer ([baa365f](https://github.com/FrontEndDev-org/openapi-axios/commit/baa365fa46d1007e30854d693f2f5a1d7d699ba7))
* **writer:** 支持 baseURL ([328f1aa](https://github.com/FrontEndDev-org/openapi-axios/commit/328f1aa9cb4495e644f1aac1a3992807efa49da6))
* **writer:** 支持枚举类型 ([58508c7](https://github.com/FrontEndDev-org/openapi-axios/commit/58508c7ba2b5c4f5f302df33dd69aaad61c521c9))
* **writer:** 新增 axiosImport 选项 ([cf9cb71](https://github.com/FrontEndDev-org/openapi-axios/commit/cf9cb71ea4dd73feeb59f0f3c2128134e2a2cbd0))
* 命令规则别名解析 ([0e9b1c3](https://github.com/FrontEndDev-org/openapi-axios/commit/0e9b1c3c563f4955df6e35b75da0a9d027109140))
* 实现 Generator ([f4e0a83](https://github.com/FrontEndDev-org/openapi-axios/commit/f4e0a83733682f2e20bae0b0f2c9cd6e7bd5a2ac))
* 新增 findOrigin ([a856c07](https://github.com/FrontEndDev-org/openapi-axios/commit/a856c0713591b6ff385500a515250898f018b63f))
* 新增 toTypePath ([d2009ac](https://github.com/FrontEndDev-org/openapi-axios/commit/d2009ac04a4ddbb82edcbfe4dc6fe722d3ea1cdc))
* 新增 varString ([5b19cc1](https://github.com/FrontEndDev-org/openapi-axios/commit/5b19cc1edc07ba194c3c0e1f4bba84b30e02263c))


### Bug Fixes

* **helpers:** 正则优化 ([01c8bb4](https://github.com/FrontEndDev-org/openapi-axios/commit/01c8bb434042229479794c8763be6f52cedbdb82))

## [0.12.0](https://github.com/FrontEndDev-org/openapi-axios/compare/v0.11.0...v0.12.0) (2023-04-01)


### Features

* 增加 pkgName, pkgVersion 导出 ([64df5da](https://github.com/FrontEndDev-org/openapi-axios/commit/64df5da808f4af73fa407bbbbfcb6d7dd5dc0055))


### Bug Fixes

* 修正相关文案说明 ([c62b0f8](https://github.com/FrontEndDev-org/openapi-axios/commit/c62b0f871a6c22d5fcdafe3d5638d345ba426be0))

## [0.11.0](https://github.com/FrontEndDev-org/openapi-axios/compare/v0.10.0...v0.11.0) (2023-04-01)


### Features

* 优化命令执行 ([02b95f3](https://github.com/FrontEndDev-org/openapi-axios/commit/02b95f32a0bda22440c3112183943419397b2f1b))
* 优化命令错误捕获 ([87cd829](https://github.com/FrontEndDev-org/openapi-axios/commit/87cd829655f7036497cfe805f2d354db83a2c8d8))
* 增强过程日志输出 ([2301612](https://github.com/FrontEndDev-org/openapi-axios/commit/230161202f42b276cf0d3ce6f8cce1518df39780))


### Bug Fixes

* node 版本要求 &gt;= 14 ([2e7f31c](https://github.com/FrontEndDev-org/openapi-axios/commit/2e7f31c1712c469a4a04c2c54e13fdbcb8af927a))
* 修复 require 引用未正常捕获错误的问题 ([8880ffa](https://github.com/FrontEndDev-org/openapi-axios/commit/8880ffa0fa7eccbff5496b71d3e7e055dc352cfe))
* 修复 rollup 构建后文件名不正确的问题 ([e2fa629](https://github.com/FrontEndDev-org/openapi-axios/commit/e2fa62997b070877837b92123406f7e1f2c029c7))
* 修复查找配置文件路径不完整的问题 ([962966b](https://github.com/FrontEndDev-org/openapi-axios/commit/962966b0951a22a5f4501f8f2415de4db2279d1d))
* 添加无副作用标记 ([3f27e5b](https://github.com/FrontEndDev-org/openapi-axios/commit/3f27e5bdd918385a9c7129b73e6415363cbbd4d6))

## [0.10.0](https://github.com/FrontEndDev-org/openapi-axios/compare/v0.9.0...v0.10.0) (2023-03-28)


### Features

* 移除对 lodash-es 的引用（node 端运行有问题） ([aaa1cf4](https://github.com/FrontEndDev-org/openapi-axios/commit/aaa1cf4fa7bc802cc337cfd0c9a4bd5da8fc87b5))


### Bug Fixes

* 修复构建生成 dts 文件不正确的问题 ([28c35ff](https://github.com/FrontEndDev-org/openapi-axios/commit/28c35ffa4def8f2354c4e47894bdfc07cb2b9116))

## [0.9.0](https://github.com/FrontEndDev-org/openapi-axios/compare/v0.8.0...v0.9.0) (2023-03-28)


### Features

* 调整配置参数，list -&gt; apis，url/spec 统一为 schema（可以是 url/path/spec） ([48731b1](https://github.com/FrontEndDev-org/openapi-axios/commit/48731b12ddd4f6b898b7b47aa5a7c3166d0f6d80))

## [0.8.0](https://github.com/FrontEndDev-org/openapi-axios/compare/v0.7.0...v0.8.0) (2023-03-27)


### Features

* 增加“鸣谢” ([bd66bda](https://github.com/FrontEndDev-org/openapi-axios/commit/bd66bda20f8c57706031e80a7a1ec665104d6084))


### Bug Fixes

* 修复 oas.config 配置文件未调整为 openapi.config ([a2cd0b0](https://github.com/FrontEndDev-org/openapi-axios/commit/a2cd0b00d6e6621c80d9f7c4dbe42ae7c427571b))
* 修正 readme 描述 ([f718aef](https://github.com/FrontEndDev-org/openapi-axios/commit/f718aef800c4748375d79bd41f40740b6d7d763c))

## [0.7.0](https://github.com/FrontEndDev-org/openapi-axios/compare/v0.6.27...v0.7.0) (2023-03-24)


### Features

* oas-gen-ts -&gt; openapi-axios ([8fef68d](https://github.com/FrontEndDev-org/openapi-axios/commit/8fef68d1bfe43b056b907ec3375055c278b741dc))

## [0.6.27](https://github.com/FrontEndDev-org/openapi-axios/compare/v0.6.26...v0.6.27) (2023-03-19)

### Bug Fixes

- update pretterrc ([3d264f6](https://github.com/FrontEndDev-org/openapi-axios/commit/3d264f6ca0e3752e51e58892b0ae8fe2469451ff))
- update README.md ([3bcefab](https://github.com/FrontEndDev-org/openapi-axios/commit/3bcefabbd02257d4e2f14740e421c7289f60ee97))
- 使用 cloudcome/publish-node-package-action@v1 进行版本发布 ([296ae78](https://github.com/FrontEndDev-org/openapi-axios/commit/296ae78c102d9a4bfb692268e76a64ea319dc644))
- 修改 package author ([05bb81a](https://github.com/FrontEndDev-org/openapi-axios/commit/05bb81acb3b78de271b338ed4ce808a8ef6e1331))

## [0.6.26](https://github.com/FrontEndDev-org/openapi-axios/compare/v0.6.25...v0.6.26) (2023-03-17)

### Bug Fixes

- 优化 actions 39 - 新增 dependency-review ([d929414](https://github.com/FrontEndDev-org/openapi-axios/commit/d9294145abe9acd3317f3c11891f0dab10aff5b4))
- 优化 actions 39 - 移除 codecov ([3976be2](https://github.com/FrontEndDev-org/openapi-axios/commit/3976be2f74e54989bc780538f137661ddd613c33))
- 优化 actions 40 ([5b44175](https://github.com/FrontEndDev-org/openapi-axios/commit/5b441753dbc1d822890f99763480ea4138b17024))
- 优化 actions 40 - 更新 readme ([e317301](https://github.com/FrontEndDev-org/openapi-axios/commit/e317301970b1bfb2e6d2d01d4524f310407469c1))

## [0.6.25](https://github.com/FrontEndDev-org/openapi-axios/compare/v0.6.24...v0.6.25) (2023-03-17)

### Bug Fixes

- 优化 actions 38 ([af3ba2d](https://github.com/FrontEndDev-org/openapi-axios/commit/af3ba2de90e705b9b9f70dbf10b23a185db0e4d0))

## [0.6.24](https://github.com/FrontEndDev-org/openapi-axios/compare/v0.6.23...v0.6.24) (2023-03-17)

### Bug Fixes

- 优化 actions 37 ([9fcc50b](https://github.com/FrontEndDev-org/openapi-axios/commit/9fcc50b607b69eacdf901df4c524ed808a21fe4f))

## [0.6.23](https://github.com/FrontEndDev-org/openapi-axios/compare/v0.6.22...v0.6.23) (2023-03-17)

### Bug Fixes

- 优化 actions 35 ([ae10697](https://github.com/FrontEndDev-org/openapi-axios/commit/ae106973059bec57b7f824d6ae04a0438418e964))
- 优化 actions 36 ([d64f741](https://github.com/FrontEndDev-org/openapi-axios/commit/d64f7413c68d2166d7fadd3ebc0b478356b12932))

## [0.6.22](https://github.com/FrontEndDev-org/openapi-axios/compare/v0.6.21...v0.6.22) (2023-03-17)

### Bug Fixes

- 优化 actions 34 ([23b1367](https://github.com/FrontEndDev-org/openapi-axios/commit/23b136754063ca35527f2a017ce15460ae707720))

## [0.6.21](https://github.com/FrontEndDev-org/openapi-axios/compare/v0.6.20...v0.6.21) (2023-03-17)

### Bug Fixes

- 优化 actions 33 ([c10eb06](https://github.com/FrontEndDev-org/openapi-axios/commit/c10eb0628ebea8d97e0c83d15cc4a18facf82e7e))

## [0.6.20](https://github.com/FrontEndDev-org/openapi-axios/compare/v0.6.19...v0.6.20) (2023-03-17)

### Bug Fixes

- 优化 actions 32 ([80b578c](https://github.com/FrontEndDev-org/openapi-axios/commit/80b578c1929e2928095c433c73550b1dd7b69b43))

## [0.6.19](https://github.com/FrontEndDev-org/openapi-axios/compare/v0.6.18...v0.6.19) (2023-03-17)

### Bug Fixes

- 优化 actions 31 ([01ea251](https://github.com/FrontEndDev-org/openapi-axios/commit/01ea251499cb9cd5b5131101de733a9ffc6e3738))

## [0.6.18](https://github.com/FrontEndDev-org/openapi-axios/compare/v0.6.17...v0.6.18) (2023-03-17)

### Bug Fixes

- 优化 actions 29 ([b0b7de2](https://github.com/FrontEndDev-org/openapi-axios/commit/b0b7de282de76aead3d8b48f0b8ff837cff97e50))
- 优化 actions 30 ([dd04a6a](https://github.com/FrontEndDev-org/openapi-axios/commit/dd04a6a087c132b836623f724a09bf0b6a8facc0))

## [0.6.17](https://github.com/FrontEndDev-org/openapi-axios/compare/v0.6.16...v0.6.17) (2023-03-17)

### Bug Fixes

- 优化 actions 28 ([06d0cea](https://github.com/FrontEndDev-org/openapi-axios/commit/06d0cea9e7d7eec1dddb2d65f3612098df058d35))

## [0.6.16](https://github.com/FrontEndDev-org/openapi-axios/compare/v0.6.15...v0.6.16) (2023-03-17)

### Bug Fixes

- 优化 actions 27 ([fc6c400](https://github.com/FrontEndDev-org/openapi-axios/commit/fc6c4007c982cbce1cff7e42973e094ae02270fc))

## [0.6.15](https://github.com/FrontEndDev-org/openapi-axios/compare/v0.6.14...v0.6.15) (2023-03-17)

### Bug Fixes

- 优化 actions 26 ([7998ef9](https://github.com/FrontEndDev-org/openapi-axios/commit/7998ef928a0491251fea26e72a495d55f3d67dae))

## [0.6.14](https://github.com/FrontEndDev-org/openapi-axios/compare/v0.6.13...v0.6.14) (2023-03-17)

### Bug Fixes

- 优化 actions 25 ([9c637e7](https://github.com/FrontEndDev-org/openapi-axios/commit/9c637e7b122fd43a6fbc9de11a8059ddeb52dc38))

## [0.6.13](https://github.com/FrontEndDev-org/openapi-axios/compare/v0.6.12...v0.6.13) (2023-03-17)

### Bug Fixes

- 优化 actions 23 ([aa9593f](https://github.com/FrontEndDev-org/openapi-axios/commit/aa9593f26e4669631d2a396bb20930357e696981))
- 优化 actions 24 ([5ae3eb1](https://github.com/FrontEndDev-org/openapi-axios/commit/5ae3eb1a6601709c3cd8354bfbb2909877528dcd))

## [0.6.12](https://github.com/FrontEndDev-org/openapi-axios/compare/v0.6.11...v0.6.12) (2023-03-17)

### Bug Fixes

- 优化 actions 21 ([2725059](https://github.com/FrontEndDev-org/openapi-axios/commit/27250593a38957875eb9e234710b5a10c373cf2b))
- 优化 actions 22 ([1c54242](https://github.com/FrontEndDev-org/openapi-axios/commit/1c542421c5241eab373e9f61041cbbf818edac0f))

## [0.6.11](https://github.com/FrontEndDev-org/openapi-axios/compare/v0.6.10...v0.6.11) (2023-03-17)

### Bug Fixes

- 优化 actions 11 ([5c3578f](https://github.com/FrontEndDev-org/openapi-axios/commit/5c3578f51b441027e804463fcde6f2cfc44b1c9a))
- 优化 actions 12 ([a684fae](https://github.com/FrontEndDev-org/openapi-axios/commit/a684faee7cdfdbfe4812bf2b0df7f6933a7231be))
- 优化 actions 13 ([99ec84b](https://github.com/FrontEndDev-org/openapi-axios/commit/99ec84b4f29b01f8c49a271b660d6370d16ec236))
- 优化 actions 14 ([793c5ef](https://github.com/FrontEndDev-org/openapi-axios/commit/793c5ef9a085607154a0b0c1d12aebc1203d6c7f))
- 优化 actions 15 ([ddc496a](https://github.com/FrontEndDev-org/openapi-axios/commit/ddc496a93fa83040822c12e3bb8cd9a544c4ceec))
- 优化 actions 16 ([b28bc1d](https://github.com/FrontEndDev-org/openapi-axios/commit/b28bc1d5c625bbe394c1c0f141700ed01a6c2627))
- 优化 actions 17 ([99a2d7d](https://github.com/FrontEndDev-org/openapi-axios/commit/99a2d7dc8f5b67f2d8fbfb3433b40c6d05a28c26))
- 优化 actions 18 ([2e2cc8d](https://github.com/FrontEndDev-org/openapi-axios/commit/2e2cc8df910ea94aec4379e162afc92dc65df5cd))
- 优化 actions 19 ([c62b53b](https://github.com/FrontEndDev-org/openapi-axios/commit/c62b53b03d9eda210fa0e4dada90fb4a9942e9fb))
- 优化 actions 20 ([ccd0358](https://github.com/FrontEndDev-org/openapi-axios/commit/ccd035894690b2dc2471fe02b7ccd4d2dfb45159))

## [0.6.10](https://github.com/FrontEndDev-org/openapi-axios/compare/v0.6.9...v0.6.10) (2023-03-16)

### Bug Fixes

- 优化 actions 10 ([bef504d](https://github.com/FrontEndDev-org/openapi-axios/commit/bef504db38bc1103aa3a5973bc66ce001dca0da0))

## [0.6.9](https://github.com/FrontEndDev-org/openapi-axios/compare/v0.6.8...v0.6.9) (2023-03-16)

### Bug Fixes

- 优化 actions 8 ([445bbfb](https://github.com/FrontEndDev-org/openapi-axios/commit/445bbfb756aaf5c6909c9e7c54ce83525e444986))
- 优化 actions 9 ([e19df0e](https://github.com/FrontEndDev-org/openapi-axios/commit/e19df0e0c4e14b64e90a06061ab7d3293262d19f))

## [0.6.8](https://github.com/FrontEndDev-org/openapi-axios/compare/v0.6.7...v0.6.8) (2023-03-16)

### Bug Fixes

- 优化 actions 7 ([ceef4a3](https://github.com/FrontEndDev-org/openapi-axios/commit/ceef4a34409d3282584798cd7fbebfa0927dfb77))

## [0.6.7](https://github.com/FrontEndDev-org/openapi-axios/compare/v0.6.6...v0.6.7) (2023-03-16)

### Bug Fixes

- 优化 actions 6 ([ba41765](https://github.com/FrontEndDev-org/openapi-axios/commit/ba4176578e04b8165b0cd8ffbd5b21d31bb8468b))

## [0.6.6](https://github.com/FrontEndDev-org/openapi-axios/compare/v0.6.5...v0.6.6) (2023-03-16)

### Bug Fixes

- 优化 actions 5 ([89f8dab](https://github.com/FrontEndDev-org/openapi-axios/commit/89f8dab3981101dc45f8fd412ef7094d6bb41e6e))

## [0.6.5](https://github.com/FrontEndDev-org/openapi-axios/compare/v0.6.4...v0.6.5) (2023-03-16)

### Bug Fixes

- 优化 actions 4 ([0243519](https://github.com/FrontEndDev-org/openapi-axios/commit/02435193e92ed67138ab55ea8e9da0b4f73ab04f))

## [0.6.4](https://github.com/FrontEndDev-org/openapi-axios/compare/v0.6.3...v0.6.4) (2023-03-16)

### Bug Fixes

- 优化 actions 2 ([c24b6e5](https://github.com/FrontEndDev-org/openapi-axios/commit/c24b6e5801dd8bb3f7aeb2f3e214d145d91a1944))
- 优化 actions 3 ([bd6de15](https://github.com/FrontEndDev-org/openapi-axios/commit/bd6de15d7dbbbcf411facb068d413330ac84f29b))

## [0.6.3](https://github.com/FrontEndDev-org/openapi-axios/compare/v0.6.2...v0.6.3) (2023-03-16)

### Bug Fixes

- 优化 actions ([a153ae7](https://github.com/FrontEndDev-org/openapi-axios/commit/a153ae7b96d2612d0d4ef44eb5e1df75bbff559b))

## [0.6.2](https://github.com/FrontEndDev-org/openapi-axios/compare/v0.6.1...v0.6.2) (2023-03-16)

### Bug Fixes

- 触发 release ([e92a1dc](https://github.com/FrontEndDev-org/openapi-axios/commit/e92a1dc2a6eaa4a8834bef21b5a85a151c6c8478))

## [0.6.1](https://github.com/FrontEndDev-org/openapi-axios/compare/v0.6.0...v0.6.1) (2023-03-16)

### Bug Fixes

- 优化 badge ([048c95f](https://github.com/FrontEndDev-org/openapi-axios/commit/048c95fdcac5e61c3ed79a379e7f27ab0c545060))
- 文档优化，触发 release-please ([d80950b](https://github.com/FrontEndDev-org/openapi-axios/commit/d80950b00d47ada37765a9216933e80de4046a6e))
- 添加注释，触发 release please ([67714f5](https://github.com/FrontEndDev-org/openapi-axios/commit/67714f5adbd534580302fa07180575787ad11823))
- 类型优化 ([8ca712d](https://github.com/FrontEndDev-org/openapi-axios/commit/8ca712d65711689ee59293820a5d31fe3d07de8d))

## [0.6.0](https://github.com/FrontEndDev-org/openapi-axios/compare/v0.5.0...v0.6.0) (2023-03-16)

### Features

- 增强 helpers 实现，增加其单元测试 ([f060a77](https://github.com/FrontEndDev-org/openapi-axios/commit/f060a7748bb2db620ca2b82f863a4e781f7a2326))
- 增强 helpers 实现，增加其单元测试 ([7e410e1](https://github.com/FrontEndDev-org/openapi-axios/commit/7e410e1a55a9041c997eac09bd4494181ac38ff9))
- 完善大部分源代码的单元测试 ([5dc6106](https://github.com/FrontEndDev-org/openapi-axios/commit/5dc61060f1cfb312ba526d349b24f930dd688414))
- 支持 dist sourceMap ([110768d](https://github.com/FrontEndDev-org/openapi-axios/commit/110768d3e4917ae52eee1feaa8e0d0290405d116))

### Bug Fixes

- 修复 Oas 类型联合错误 ([7bac37c](https://github.com/FrontEndDev-org/openapi-axios/commit/7bac37ccde5901dcdbdb322d05d9628b363998bb))
- 兼容 JSON 配置文件 ([1a380fa](https://github.com/FrontEndDev-org/openapi-axios/commit/1a380faebb5ee323cb0bd0b2db419a560a5a9b0a)), closes [#48](https://github.com/FrontEndDev-org/openapi-axios/issues/48)

## [0.5.0](https://github.com/FrontEndDev-org/openapi-axios/compare/v0.4.0...v0.5.0) (2023-03-15)

### Features

- chalk 降级为 4，因为需要兼容 cjs/esm 两种格式 ([d19dc80](https://github.com/FrontEndDev-org/openapi-axios/commit/d19dc801bbc8744223e5dd740380d2f934caa462))
- 增加生成步骤提示 ([b0aad3a](https://github.com/FrontEndDev-org/openapi-axios/commit/b0aad3ae202c125caacdb3629556fd8122e2c2e1))

## [0.4.0](https://github.com/FrontEndDev-org/openapi-axios/compare/v0.3.0...v0.4.0) (2023-03-15)

### Features

- 优化构建命令 ([b4e3584](https://github.com/FrontEndDev-org/openapi-axios/commit/b4e358400e0b50fd4f97c9fcf021fbd0620ae002))
- 新增配置项 unwrapResponseData ([c2441b3](https://github.com/FrontEndDev-org/openapi-axios/commit/c2441b3ba87c82fd82d006126cb4228e163b2acb))

### Bug Fixes

- 生成文件目录可能为空的问题 ([ab33280](https://github.com/FrontEndDev-org/openapi-axios/commit/ab33280a800a9231e91cd8bd733b5b48e236f90f))

## [0.3.0](https://github.com/FrontEndDev-org/openapi-axios/compare/v0.2.0...v0.3.0) (2023-03-15)

### Features

- init project ([a5b8ed4](https://github.com/FrontEndDev-org/openapi-axios/commit/a5b8ed4db3fcad45b859364fe4aaf62a2b8cd768))
- 增加编译命令 ([34c49a1](https://github.com/FrontEndDev-org/openapi-axios/commit/34c49a125c7f3d3d81150db03202ecf78ded256f))
- 实现基本功能 ([6b932f8](https://github.com/FrontEndDev-org/openapi-axios/commit/6b932f89976625047e228558e05f2bb18d6e23ac))

## [0.2.0](https://github.com/FrontEndDev-org/openapi-axios/compare/v0.1.4...v0.2.0) (2023-03-15)

### Features

- rename oas_ts -&gt; openapi-axios ([b00efb0](https://github.com/FrontEndDev-org/openapi-axios/commit/b00efb0277110da57dffa52c0960dad4d54f68c5))

## [0.1.4](https://github.com/cloudcome/oas_ts/compare/v0.1.3...v0.1.4) (2023-03-15)

### Bug Fixes

- publish 条件 6 ([6bbfffd](https://github.com/cloudcome/oas_ts/commit/6bbfffdc2d5387a186abb7a819908b31cb29a828))

## [0.1.3](https://github.com/cloudcome/oas_ts/compare/v0.1.2...v0.1.3) (2023-03-15)

### Bug Fixes

- publish 条件 5 ([61bc4ab](https://github.com/cloudcome/oas_ts/commit/61bc4abbc8bf25fcb9703ed37b19d88da933b2fb))

## [0.1.2](https://github.com/cloudcome/oas_ts/compare/v0.1.1...v0.1.2) (2023-03-15)

### Bug Fixes

- publish 条件 4 ([7bf06f6](https://github.com/cloudcome/oas_ts/commit/7bf06f6ff93aadbad8816a0ad16f4ff2d9c814ce))

## [0.1.1](https://github.com/cloudcome/oas_ts/compare/v0.1.0...v0.1.1) (2023-03-15)

### Bug Fixes

- npm publish 指定仓库 ([b438e99](https://github.com/cloudcome/oas_ts/commit/b438e994ed1c694def97209c4078c4021346b140))
- publish 条件 ([51a0f08](https://github.com/cloudcome/oas_ts/commit/51a0f080b8d65c5470daab1b5035f52c28f59972))
- publish 条件 ([c3f615a](https://github.com/cloudcome/oas_ts/commit/c3f615a79c9b4234f95b1c41a35ef459f3e5932f))
- publish 条件 2 ([480611d](https://github.com/cloudcome/oas_ts/commit/480611d0fc38ad320578620f6d18491778524850))
- publish 条件 3 ([5e1e75f](https://github.com/cloudcome/oas_ts/commit/5e1e75f75343799fc5a2273fa6ef60bba8ac7535))
- update README.md ([d7f5856](https://github.com/cloudcome/oas_ts/commit/d7f5856d868001fe3f099b8ee0aa564a49ca2c70))

## [0.1.0](https://github.com/cloudcome/oas_ts/compare/v0.0.0...v0.1.0) (2023-03-15)

### Features

- 排除指定版本 ([53bba08](https://github.com/cloudcome/oas_ts/commit/53bba08e52df8c056248569ec2bbc980f4751a49))

## 0.0.0 (2023-03-15)

### Features

- test github workflow ([51bb312](https://github.com/cloudcome/oas_ts/commit/51bb312415b5b4144b51a290169bf4fc5daee515))
- 指定版本为 0.0.0 ([f330210](https://github.com/cloudcome/oas_ts/commit/f3302103f029c9be694717c5897c2944d994099c))

### Bug Fixes

- test GitHub workflow 15 ([801f519](https://github.com/cloudcome/oas_ts/commit/801f5190994a72525a78c246960e0d694602202a))
