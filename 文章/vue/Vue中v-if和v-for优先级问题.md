### Vue 中 v-if 和 v-for 优先级问题

#### 源码阅读

源码位置：`/compiler/codegen/index.js`

```javascript
export function genElement (el: ASTElement, state: CodegenState): string {
  if (el.parent) {
    el.pre = el.pre || el.parent.pre
  }

  if (el.staticRoot && !el.staticProcessed) {
    return genStatic(el, state)
  } else if (el.once && !el.onceProcessed) {
    return genOnce(el, state)
  } else if (el.for && !el.forProcessed) { // 优先判断 for
    return genFor(el, state)
  } else if (el.if && !el.ifProcessed) { // 其次判断 if
    return genIf(el, state)
  } else if (el.tag === 'template' && !el.slotTarget && !state.pre) {
    return genChildren(el, state) || 'void 0'
  } else if (el.tag === 'slot') {
    return genSlot(el, state)
  } else {
    // component or element
    let code
    if (el.component) {
      code = genComponent(el.component, el, state)
    } else {
      let data
      if (!el.plain || (el.pre && state.maybeComponent(el))) {
        data = genData(el, state)
      }

      const children = el.inlineTemplate ? null : genChildren(el, state, true)
      code = `_c('${el.tag}'${
        data ? `,${data}` : '' // data
      }${
        children ? `,${children}` : '' // children
      })`
    }
    // module transforms
    for (let i = 0; i < state.transforms.length; i++) {
      code = state.transforms[i](el, code)
    }
    return code
  }
}
```

#### 结论

* `v-for` 和 `v-if` 一起使用的时候，`v-for` 优先于 `v-if`，所以不要一起使用，因为每一个循环都会去判断，这样会导致循环不可避免，浪费性能

* 尝试去使用 `computed` 去过滤出需要渲染的数据