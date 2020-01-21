/* @flow */

import config from 'core/config'
import { warn, cached } from 'core/util/index'
import { mark, measure } from 'core/util/perf'

import Vue from './runtime/index'
import { query } from './util/index'
import { compileToFunctions } from './compiler/index'
import { shouldDecodeNewlines, shouldDecodeNewlinesForHref } from './util/compat'

// 节点缓存
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
