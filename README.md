# Vue Bucket

### Read Vue

Vue 源码注解：vue/src

* [Vue 中 toRawType 是用来做什么的?](https://github.com/YangYmimi/read-vue/issues/1)
* [Vue 源码中提供的一些 Util 方法](https://github.com/YangYmimi/read-vue/issues/2)
* [Vue 中纯函数缓存如何实现的?](https://github.com/YangYmimi/read-vue/issues/3)
* [lodash 中对于 array-like 的定义](https://github.com/YangYmimi/read-vue/issues/4)
* [Vue 中 bind 实现](https://github.com/YangYmimi/read-vue/issues/5)
* [Vue 中 loose equal 实现](https://github.com/YangYmimi/read-vue/issues/6)
* [Vue 中 UA 判断](https://github.com/YangYmimi/read-vue/issues/7)

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

#### 相关文章整理

* [Vuex 中辅助函数 mapState 的实现解读](https://github.com/YangYmimi/read-vue/issues/8)
* [Vuex 插件机制](https://github.com/YangYmimi/read-vue/issues/9)
* [Vuex 中如何利用深拷贝比较 state 前后变化?](https://github.com/YangYmimi/read-vue/issues/10)

### Read Vue-Router

Vue-Router 源码注解：vue-router/src

### References

* https://github.com/answershuto/learnVue

* http://hcysun.me/vue-design/zh/

* https://ustbhuangyi.github.io/vue-analysis/
