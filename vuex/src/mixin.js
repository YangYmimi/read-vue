export default function (Vue) {
  const version = Number(Vue.version.split('.')[0])

  if (version >= 2) {
    // 采用全局混入方式将 store 对象绑定到 Vue 实例
    /* 我们使用的时候将 store 丢到了 Vue.$options 内
    new Vue({
      store, // inject store to all children
      el: '#app',
      render: h => h(App)
    })
    */
    Vue.mixin({ beforeCreate: vuexInit })
  } else {
    // override init and inject vuex init procedure
    // for 1.x backwards compatibility.
    const _init = Vue.prototype._init
    Vue.prototype._init = function (options = {}) {
      options.init = options.init
        ? [vuexInit].concat(options.init)
        : vuexInit
      _init.call(this, options)
    }
  }

  /**
   * Vuex init hook, injected into each instances init hooks list.
   */

  function vuexInit () {
    // 这边 this 是 Vue 实例
    const options = this.$options
    // store injection
    if (options.store) {
      // 这边就是默认的实例化过程
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store
    }
  }
}
