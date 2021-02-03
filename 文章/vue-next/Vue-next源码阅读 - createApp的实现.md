### Vue-next 源码阅读之 createApp的实现

[文档](https://vue3js.cn/docs/zh/api/global-api.html#createapp)

#### 源码阅读

1. `packages/vue/src/index.ts`

导出了 createApp 方法，但是本身这个文件没有定义，顺着文件 import 找下去

2. `packages/runtime-dom/src/index.ts`

这边就是 createApp 定义的地方了

```ts
import {
  createRenderer,
  ......
  CreateAppFunction,
  ......
} from "@vue/runtime-core"

......

function ensureRenderer() {
  // createRenderer 由 @vue/runtime-core 导出
  // 又可以从 @vue/runtime-core 发现它实际从 @vue/runtime-core/src/renderer 导出
  return renderer || (renderer = createRenderer<Node, Element>(rendererOptions))
}

......

export const createApp = ((...args) => {
  // 应用上下文的应用实例
  // 原来 app 实例是由 ensureRenderer 方法返回的 createApp 方法调用生成的
  const app = ensureRenderer().createApp(...args)

  if (__DEV__) {
    injectNativeTagCheck(app)
  }

  const { mount } = app
  app.mount = (containerOrSelector: Element | ShadowRoot | string): any => {
    // 根组件挂载
    const container = normalizeContainer(containerOrSelector)
    if (!container) return
    const component = app._component
    if (!isFunction(component) && !component.render && !component.template) {
      component.template = container.innerHTML
    }
    // clear content before mounting
    container.innerHTML = ""
    const proxy = mount(container)
    if (container instanceof Element) {
      container.removeAttribute("v-cloak")
      container.setAttribute("data-v-app", "")
    }
    return proxy
  }

  // 返回应用实例
  // 可以链式调用实例方法
  return app
}) as CreateAppFunction<Element>

......

// 获取根元素
function normalizeContainer(container: Element | ShadowRoot | string): Element | null {
  if (isString(container)) {
    const res = document.querySelector(container)
    if (__DEV__ && !res) {
      warn(`Failed to mount app: mount target selector "${container}" returned null.`)
    }
    return res
  }
  // Dev 代码可以忽略
  if (__DEV__ && container instanceof ShadowRoot && container.mode === "closed") {
    warn(`mounting on a ShadowRoot with \`{mode: "closed"}\` may lead to unpredictable bugs`)
  }
  return container as any
}
```

`createRenderer` 从 `packages/runtime-core/src/index.ts` 中导出，`packages/runtime-core/src/index.ts` 中又从 `packages/runtime-core/src/renderer.ts` 中被导出

```ts
export function createRenderer<HostNode = RendererNode, HostElement = RendererElement>(
  options: RendererOptions<HostNode, HostElement>
) {
  return baseCreateRenderer<HostNode, HostElement>(options)
}
```

`baseCreateRenderer` 的实现如下：

```ts
function baseCreateRenderer(options: RendererOptions, createHydrationFns?: typeof createHydrationFunctions): any {
  // compile-time feature flags check
  if (__ESM_BUNDLER__ && !__TEST__) {
    initFeatureFlags()
  }

  const {
    insert: hostInsert,
    remove: hostRemove,
    patchProp: hostPatchProp,
    forcePatchProp: hostForcePatchProp,
    createElement: hostCreateElement,
    createText: hostCreateText,
    createComment: hostCreateComment,
    setText: hostSetText,
    setElementText: hostSetElementText,
    parentNode: hostParentNode,
    nextSibling: hostNextSibling,
    setScopeId: hostSetScopeId = NOOP,
    cloneNode: hostCloneNode,
    insertStaticContent: hostInsertStaticContent
  } = options

  ......

  return {
    // 渲染函数
    render,
    hydrate,
    // https://v3.cn.vuejs.org/api/global-api.html#createapp
    createApp: createAppAPI(render, hydrate)
  }
}

```