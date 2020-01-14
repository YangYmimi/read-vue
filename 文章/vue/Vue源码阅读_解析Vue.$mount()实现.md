### 解析Vue.$mount()实现

[文档](https://cn.vuejs.org/v2/api/#vm-mount)

#### 源码阅读

1. 找到 `package.json`

```json
"dev": "rollup -w -c scripts/config.js --sourcemap --environment TARGET:web-full-dev"
```

找到对应的 `scripts/config.js` 文件看打包的源文件地址。如下

```javascript
// Runtime+compiler development build (Browser)
// 运行时和编译时 开发环境打包。用于浏览器引用。
// 文件路径：src/platforms/web/entry-runtime-with-compiler.js
'web-full-dev': {
  entry: resolve('web/entry-runtime-with-compiler.js'),
  dest: resolve('dist/vue.js'),
  format: 'umd',
  env: 'development',
  alias: { he: './entity-decoder' },
  banner
},
```

找到对应的 `web/entry-runtime-with-compiler.js` 则找到了 `$mount()` 方法。

```javascript
const idToTemplate = cached(id => {
  const el = query(id)
  // 将 el 的内部作为视图内容
  return el && el.innerHTML
})

// 暂存Vue的实例方法：Vue.$mount()
const mount = Vue.prototype.$mount
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {

  // Vue 在实例化的时候需要有个挂载元素，如果没有的话执行 vm.$mount() 就会有个默认的挂载
  el = el && query(el)

  /* istanbul ignore if */
  if (el === document.body || el === document.documentElement) {
    process.env.NODE_ENV !== 'production' && warn(
      `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
    )
    return this
  }

  // 暂存 Vue 全局配置（构造函数传入）
  const options = this.$options
  // resolve template/el and convert to render function
  // 优先级：render函数 -> template -> el
  // 没有 render 函数的话，我们就会需要有 template 来作为字符串模板，来替换挂载的元素
  if (!options.render) {
    let template = options.template
    if (template) {
      // 如果 template 是一个 # 开头的字符串，则会当作选择器，然后匹配元素的 innerHtml 作为模板
      if (typeof template === 'string') {
        if (template.charAt(0) === '#') {
          template = idToTemplate(template)
          /* istanbul ignore if */
          if (process.env.NODE_ENV !== 'production' && !template) {
            warn(
              `Template element not found or is empty: ${options.template}`,
              this
            )
          }
        }
      } else if (template.nodeType) {
        template = template.innerHTML
      } else {
        if (process.env.NODE_ENV !== 'production') {
          warn('invalid template option:' + template, this)
        }
        return this
      }
    } else if (el) {
      // 如果没有 render 函数也没有配置 template 那么就使用 el 选项，当作选择器拿到 innerHtml
      // 将 el 的内部 dom 全部作为 模板
      template = getOuterHTML(el)
    }
    if (template) {
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile')
      }

      // 将一个模板字符串编译成render函数
      const { render, staticRenderFns } = compileToFunctions(template, {
        outputSourceRange: process.env.NODE_ENV !== 'production',
        shouldDecodeNewlines,
        shouldDecodeNewlinesForHref,
        // 默认的插值分隔符 ["{{", "}}"]
        delimiters: options.delimiters,
        // 浏览器编译时候, 是否保留注释
        comments: options.comments
      }, this)
      // 设置 render 函数到选项
      options.render = render
      options.staticRenderFns = staticRenderFns

      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile end')
        measure(`vue ${this._name} compile`, 'compile', 'compile end')
      }
    }
  }

  //挂载, this 就是 Vue 实例
  return mount.call(this, el, hydrating)
}

/**
 * Get outerHTML of elements, taking care
 * of SVG elements in IE as well.
 */
function getOuterHTML (el: Element): string {
  if (el.outerHTML) {
    return el.outerHTML
  } else {
    const container = document.createElement('div')
    container.appendChild(el.cloneNode(true))
    return container.innerHTML
  }
}

// 全局实例 API, 将一个模板字符串编译成render函数
Vue.compile = compileToFunctions

export default Vue
```

由于第一行做了一件事情 `const mount = Vue.prototype.$mount`, 这意味着我们将初始的原型方法 `$mount()` 做了一个暂存，然后重写了该方法，接下来找到初始的 `Vue.$mount()` 定义的地方。`Vue.$mount()` 属于实例方法所以，理论上会在 `Vue.prototype` 上访问到。

```javascript
// 源码位置：`\src\platforms\web\runtime\index.js`

... some code ...

// $mount() 本身支持传递 string 和 element
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  // 其实就是为了获取到挂载的根节点
  el = el && inBrowser ? query(el) : undefined
  return mountComponent(this, el, hydrating)
}

... some code ...
```

我们了解一下 `query()` 方法做了什么事情

```javascript
// 源码位置：\src\platforms\web\util\index.js
// 参数支持 string 和 dom 元素
export function query (el: string | Element): Element {
  if (typeof el === 'string') {
    const selected = document.querySelector(el)
    if (!selected) {
      process.env.NODE_ENV !== 'production' && warn(
        'Cannot find element: ' + el
      )
      return document.createElement('div')
    }
    // selected 自始至终都是 dom 元素的节点
    return selected
  } else {
    return el
  }

  // 返回 Dom 元素
}
```

现在我们就可以明白之前手动挂载 `el` 的时候 `.$mount('#app')` 这样写的目的了

接下来看一下 `$mount()` 中 `mountComponent(this, el, hydrating)` 做了什么

```javascript
// 方法定义源码地址：\src\core\instance\lifecycle.js

... some code ...

export function mountComponent (
  vm: Component,
  el: ?Element,
  hydrating?: boolean
): Component {
  vm.$el = el // 赋值给 $el
  if (!vm.$options.render) {
    // 赋值 $options.render 配置, 虚拟 DOM 函数
    vm.$options.render = createEmptyVNode
    if (process.env.NODE_ENV !== 'production') {
      /* istanbul ignore if */
      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el || el) {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
          'compiler is not available. Either pre-compile the templates into ' +
          'render functions, or use the compiler-included build.',
          vm
        )
      } else {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        )
      }
    }
  }
  // 调用生命周期函数 `beforeMount()`
  callHook(vm, 'beforeMount')

  let updateComponent
  /* istanbul ignore if */
  if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
    updateComponent = () => {
      const name = vm._name
      const id = vm._uid
      const startTag = `vue-perf-start:${id}`
      const endTag = `vue-perf-end:${id}`

      mark(startTag)
      const vnode = vm._render()
      mark(endTag)
      measure(`vue ${name} render`, startTag, endTag)

      mark(startTag)
      vm._update(vnode, hydrating)
      mark(endTag)
      measure(`vue ${name} patch`, startTag, endTag)
    }
  // 上面是调试代码，忽略了
  } else {
    updateComponent = () => {
      vm._update(vm._render(), hydrating)
    }
  }

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  // 实例化 Watcher，在初始化的时候执行回调函数 updateComponent 方法，并且当vm实例中检测的数据发生变化的时候执行此回调函数
  // _render() 这个方法会生成 VNode，并且还会使用 _update() 方法去更新 VNode
  new Watcher(vm, updateComponent, noop, {
    before () {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate')
      }
    }
  }, true /* isRenderWatcher */)
  hydrating = false

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  // vm.$vnode 是什么? 这边是父 VNode，当此 VNode 是 null 的时候则为根实例
  if (vm.$vnode == null) {
    vm._isMounted = true
    callHook(vm, 'mounted')
  }
  // 返回实例自身，所以可以链式调用其它实例方法
  return vm
}

... some code ...
```

### 总结

`$mount`：主要做了挂载的事情。对于挂载的元素定义的优先级，优先使用 `render`， 其次使用 `template`，`template` 支持 `html` 方式，或者 `#` 前缀方式（id选择器），最后使用 `el` 作为挂载元素。除了挂载之外，在方法定义中还做了