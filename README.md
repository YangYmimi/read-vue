# Vue Bucket

### Read Vue

#### 目录结构

```
src
├── compiler          # 编译相关
├── core              # 核心代码
  ├── components      # 通用组件(所有平台通用的，包括 web 平台，weex 平台等) keep-alive
  ├── global-api      # 全局 API
      ├── use.js      # 定义 Vue.use，Vue 插件机制
  ├── instance        # 构造函数
    ├── index.js      # 定义 Vue 的构造函数
    ├── init.js       # 定义了 Vue 构造函数中使用的 _init() 方法
    ├── lifecycle.js  # 定义了 mountComponent 组件挂载函数
  ├── oberver         # 数据响应式代码
    ├── array.js      # 覆盖数组原型方法，对数组操作进行响应式处理
  ├── vdom            # 虚拟 dom 相关
  ├── index.js        # 主要定义了 Vue 的全局 API
├── platforms         # 不同平台的支持
  ├── web
    ├── runtime
      ├── index.js                        # 定义 $mount
    ├── entry-runtime-with-compiler.js    # Web平台入口文件，覆盖 $mount，执行模板解析和编译工作
├── server            # 服务端渲染
├── sfc               # .vue 文件解析
├── shared            # 共享代码
```

#### Vue相关文章整理

* [Vue 中 toRawType 是用来做什么的?](https://github.com/YangYmimi/read-vue/issues/1)
* [Vue 源码中提供的一些 Util 方法](https://github.com/YangYmimi/read-vue/issues/2)
* [Vue 中纯函数缓存如何实现的?](https://github.com/YangYmimi/read-vue/issues/3)
* [lodash 中对于 array-like 的定义](https://github.com/YangYmimi/read-vue/issues/4)
* [Vue 中 bind 实现](https://github.com/YangYmimi/read-vue/issues/5)
* [Vue 中 loose equal 实现](https://github.com/YangYmimi/read-vue/issues/6)
* [Vue 中 UA 判断](https://github.com/YangYmimi/read-vue/issues/7)
* [Vue 中 keep-alive 的理解](https://github.com/YangYmimi/read-vue/issues/13)
* [Vue 中组件通信的方式](https://github.com/YangYmimi/read-vue/issues/12)
* [Vue 中 v-if 和 v-for 优先级问题](https://github.com/YangYmimi/read-vue/issues/16)
* [Vue 中组件 data 为什么需要是函数形式而根实例却没有限制](https://github.com/YangYmimi/read-vue/issues/17)
* [Vue源码阅读 - 解析Vue.$mount()实现](https://github.com/YangYmimi/read-vue/issues/11)
* [Vue源码阅读 - 生命周期](https://github.com/YangYmimi/read-vue/issues/14)
* [Vue源码阅读 - 异步更新队列](https://github.com/YangYmimi/read-vue/issues/15)
* [Vue源码阅读 - 虚拟Dom](https://github.com/YangYmimi/read-vue/issues/18)
* [Vue源码阅读 - diff算法]()

### Read Vuex

Vuex 源码注解：vuex/src

#### Vuex 的实现思路

* 实例初始化:

实现插件的 `install` 方法。并且需要把 `Store` 实例绑定到 `Vue` 的根实例上, 这样就可以通过 `Vue.$store` 去访问了。

* state:

Vuex 使用 Vue 的 data 去实现 state 的响应式。然后提供了 `get()` 存取器提供给外界访问 state

```
store._vm = new Vue({
  data: {
    $$state: state
  },
  computed
})

get state () {
  return this._vm._data.$$state
}
```

#### Vuex相关文章整理

* [Vuex 中辅助函数 mapState 的实现解读](https://github.com/YangYmimi/read-vue/issues/8)
* [Vuex 插件机制](https://github.com/YangYmimi/read-vue/issues/9)
* [Vuex 中如何利用深拷贝比较 state 前后变化?](https://github.com/YangYmimi/read-vue/issues/10)

### Read Vue-Router

Vue-Router 源码注解：vue-router/src

### References

* https://github.com/answershuto/learnVue

* http://hcysun.me/vue-design/zh/

* https://ustbhuangyi.github.io/vue-analysis/
