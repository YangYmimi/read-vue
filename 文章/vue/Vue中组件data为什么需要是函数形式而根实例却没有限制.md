### Vue 中组件 data 为什么需要是函数形式而根实例却没有限制

#### 源码阅读

源码位置：`/core/instance/state.js - initData()`

```javascript
function initData (vm: Component) {
  let data = vm.$options.data
  // data 可以是 function (单个组件) 也可以是 object (根组件)
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {}
  if (!isPlainObject(data)) {
    data = {}
    process.env.NODE_ENV !== 'production' && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    )
  }
  // proxy data on instance
  const keys = Object.keys(data)
  const props = vm.$options.props
  const methods = vm.$options.methods
  let i = keys.length
  while (i--) {
    const key = keys[i]
    if (process.env.NODE_ENV !== 'production') {

      // 判断methods内是否用重名的data定义
      if (methods && hasOwn(methods, key)) {
        warn(
          `Method "${key}" has already been defined as a data property.`,
          vm
        )
      }
    }

    // 判断props内是否用重名的data定义
    if (props && hasOwn(props, key)) {
      process.env.NODE_ENV !== 'production' && warn(
        `The data property "${key}" is already declared as a prop. ` +
        `Use prop default value instead.`,
        vm
      )
    } else if (!isReserved(key)) {
      proxy(vm, `_data`, key)
    }
  }
  // observe data
  // 启动响应式
  observe(data, true /* asRootData */)
}

export function getData (data: Function, vm: Component): any {
  // #7573 disable dep collection when invoking data getters
  pushTarget()
  try {
    // 在当前 vm 上执行 data 函数，并把当前 vm 当作参数传递
    return data.call(vm, vm)
  } catch (e) {
    handleError(e, vm, `data()`)
    return {}
  } finally {
    popTarget()
  }
}
```

#### 结论

Vue 在初始化的时候，通过 `new Vue()` 的方式创建一个根实例，全局唯一的，所以在此时用 对象 的方式去设置 data 是可以的。

但是组件中，如果使用对象方式设置 data，那么所有该组件（该组件可能会有多个实例）用到 data 的地方都是引用了这一个 data（共用了 data），这样就会冲突了。

我们可以在源码中看到，利用 getData （这个就是一个工厂函数，SSR 中也使用该方式创建 router，vuex 的实例）去生成对当前组件实例唯一的 data 选项（`data.call(vm, vm)`）