/* @flow */

import * as nodeOps from 'web/runtime/node-ops'
import { createPatchFunction } from 'core/vdom/patch'
import baseModules from 'core/vdom/modules/index'
import platformModules from 'web/runtime/modules/index'

// the directive module should be applied last, after all
// built-in modules have been applied.
const modules = platformModules.concat(baseModules)
// => modules = [attrs, klass, events, domProps, style, transition].concat([ref, directives])

// createPatchFunction 是个工厂函数
// 传递不同平台特有的节点操作的方法给该工厂函数，返回 patch 方法
export const patch: Function = createPatchFunction({ nodeOps, modules })
