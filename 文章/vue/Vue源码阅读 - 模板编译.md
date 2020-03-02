### Vue源码阅读 - 模板编译

> 模板编译主要目的：将模板（template）转换成渲染函数（render）

#### 整体流程

##### compileToFunctions

源码位置：`src\platforms\web\entry-runtime-with-compiler.js`

```javascript
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

      // 将一个模板字符串编译成 render 函数
      // 其实和自己写 render 一样
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
```

##### 编译过程

源码位置：`src\compiler\index.js`

  - parse 阶段（源码位置：`src\compiler\parser\index.js`）：解析器有三种，HTML解析器，文本解析器，过滤器解析器，将模板解析成 AST（抽象语法树）

  - optimize 阶段（源码位置：`src\compiler\optimizer.js`）：对 AST 进行优化，比如标记纯文本节点，这样 patch 的时候就直接跳过就行了

  - generate 阶段（源码位置：`src\compiler\codegen\index.js`）：将 AST 转换成渲染函数中的内容，也就是 render() 函数的返回值，代码字符串，关于代码字符串的部分定义（源码位置：`src\core\instance\render-helpers\index.js`）。

以 `src\compiler\index.js` 为例去看整体流程

```javascript
/* @flow */

import { parse } from './parser/index'
import { optimize } from './optimizer'
import { generate } from './codegen/index'
import { createCompilerCreator } from './create-compiler'

// `createCompilerCreator` allows creating compilers that use alternative
// parser/optimizer/codegen, e.g the SSR optimizing compiler.
// Here we just export a default compiler using the default parts.
export const createCompiler = createCompilerCreator(function baseCompile (
  template: string,
  options: CompilerOptions
): CompiledResult {
  // 解析：模板转换成对象（AST，抽象语法树）
  const ast = parse(template.trim(), options)

  // 优化：标记一些静态节点，diff算法就可以直接忽略，节省diff时间
  if (options.optimize !== false) {
    optimize(ast, options)
  }

  // 代码生成：将AST转换成代码字符串 new Function(code) 就可以得到函数
  const code = generate(ast, options)
  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
})
```
