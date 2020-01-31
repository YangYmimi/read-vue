import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'

// Vue 的构造函数
function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }

  // _init 通过 Vue 的 mixin 混入
  this._init(options)
}

// 混入 _init 方法 ( Vue.prototype._init )
initMixin(Vue)
// 和状态相关混入，定义了实例属性，实例方法，诸如：vm.$data, vm.$props, vm.$set, vm.$watch
stateMixin(Vue)
// 事件相关，诸如：vm.$emit, vm.$on, vm.$once, vm.$off
eventsMixin(Vue)
// 生命周期相关，诸如：vm.$forceUpdate, vm.$mount, vm.$destory
lifecycleMixin(Vue)
// 混入 render 方法 ( Vue.prototype._render ), vm.$nextTick
renderMixin(Vue)

export default Vue
