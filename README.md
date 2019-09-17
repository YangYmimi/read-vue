# Read Vue

> Vue Roadmap

### 文件结构

#### dist

| | UMD | CommonJS | ES Module |
| --- | --- | --- | --- |
| **Full** | vue.js | vue.common.js | vue.esm.js |
| **Runtime-only** | vue.runtime.js | vue.runtime.common.js | vue.runtime.esm.js |
| **Full (production)** | vue.min.js | | |
| **Runtime-only (production)** | vue.runtime.min.js | | |

Reference:

[1. Vue - 对不同构建版本的解释](https://cn.vuejs.org/v2/guide/installation.html#%E5%AF%B9%E4%B8%8D%E5%90%8C%E6%9E%84%E5%BB%BA%E7%89%88%E6%9C%AC%E7%9A%84%E8%A7%A3%E9%87%8A)

[2. 运行时+编译器 vs 运行时](https://cn.vuejs.org/v2/guide/installation.html#%E8%BF%90%E8%A1%8C%E6%97%B6-%E7%BC%96%E8%AF%91%E5%99%A8-vs-%E5%8F%AA%E5%8C%85%E5%90%AB%E8%BF%90%E8%A1%8C%E6%97%B6)

### Read Code

以 UMD 构建的 `vue.js` 版本 [Code](/node_modules/vue/dist/vue.js)

* [Vue 中 toRawType 是用来做什么的?](https://github.com/YangYmimi/read-vue/issues/1)
* [Vue 源码中提供的一些 Util 方法](https://github.com/YangYmimi/read-vue/issues/2)
* [Vue 中纯函数缓存如何实现的?](https://github.com/YangYmimi/read-vue/issues/3)
* [lodash 中对于 array-like 的定义](https://github.com/YangYmimi/read-vue/issues/4)
* [Vue 中 bind 实现](https://github.com/YangYmimi/read-vue/issues/5)
* [Vue 中 loose equal 实现](https://github.com/YangYmimi/read-vue/issues/6)
* [Vue 中 UA 判断](https://github.com/YangYmimi/read-vue/issues/7)

### Reference

* https://github.com/answershuto/learnVue

* http://hcysun.me/vue-design/zh/