import attrs from './attrs'
import klass from './class'
import events from './events'
import domProps from './dom-props'
import style from './style'
import transition from './transition'

// 属性相关，节点相关，样式相关等操作通过模块方式暴露出来给外部调用
export default [
  attrs,
  klass,
  events,
  domProps,
  style,
  transition
]
