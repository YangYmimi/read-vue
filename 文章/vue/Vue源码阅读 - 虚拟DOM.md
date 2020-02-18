### Vue源码阅读 - 虚拟DOM

Vue 里面利用 [snabbdom](https://github.com/snabbdom/snabbdom) 构造虚拟Dom。

#### 源码阅读

`lifecycle.js` 内定义的 `updateComponent` 方法内调用了

1. `_render()` => 获取虚拟 Dom
2. `_update()` => 将虚拟Dom更新成真实Dom

其中，`instance/render.js` 定义了 `_render()`；`vdom/patch.js` 定义了 `_update()`

* _render() 函数

`instance/render.js` 文件中定义了 `_render()` 的实现

```javascript
Vue.prototype._render = function (): VNode {
  const vm: Component = this
  // vm.$options 中定义了 render 方法，该方法就是 `vdom/vnode` 中的 createEmptyVNode
  // 这个在 `lifecycle.js` 中的 mountComponent 中有设置，也就是说在 mount() 环节设置了 render 函数
  const { render, _parentVnode } = vm.$options

  if (_parentVnode) {
    vm.$scopedSlots = normalizeScopedSlots(
      _parentVnode.data.scopedSlots,
      vm.$slots,
      vm.$scopedSlots
    )
  }

  // set parent vnode. this allows render functions to have access
  // to the data on the placeholder node.
  vm.$vnode = _parentVnode
  // render self
  let vnode
  try {
    // There's no need to maintain a stack because all render fns are called
    // separately from one another. Nested component's render fns are called
    // when parent component is patched.
    currentRenderingInstance = vm
    vnode = render.call(vm._renderProxy, vm.$createElement)
  } catch (e) {
    handleError(e, vm, `render`)
    // return error render result,
    // or previous vnode to prevent render error causing blank component
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production' && vm.$options.renderError) {
      try {
        vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e)
      } catch (e) {
        handleError(e, vm, `renderError`)
        vnode = vm._vnode
      }
    } else {
      vnode = vm._vnode
    }
  } finally {
    currentRenderingInstance = null
  }
  // if the returned array contains only a single node, allow it
  if (Array.isArray(vnode) && vnode.length === 1) {
    vnode = vnode[0]
  }
  // return empty vnode in case the render function errored out
  if (!(vnode instanceof VNode)) {
    if (process.env.NODE_ENV !== 'production' && Array.isArray(vnode)) {
      warn(
        'Multiple root nodes returned from render function. Render function ' +
        'should return a single root node.',
        vm
      )
    }
    vnode = createEmptyVNode()
  }
  // set parent
  vnode.parent = _parentVnode

  // 返回最新的 vDom
  return vnode
}
```

* _update() 函数

`lifecycle.js` 文件中定义了 `_update()` 的实现

```javascript
export function lifecycleMixin (Vue: Class<Component>) {
  Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
    const vm: Component = this
    const prevEl = vm.$el
    // 前一个 vDom
    const prevVnode = vm._vnode
    const restoreActiveInstance = setActiveInstance(vm)
    // 将传入的 vDom 更新成 _vnode 以便之后做对比
    vm._vnode = vnode
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    // 如果没有前一个 vDom，那么属于首次初始化
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */)
    } else {
      // updates
      // 如果有，那么利用 __patch__ 函数进行对比
      vm.$el = vm.__patch__(prevVnode, vnode)
    }
    restoreActiveInstance()
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  }

  ... some code
}
```