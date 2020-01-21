/* @flow */

import { toArray } from '../util/index'

// Vue.use()
export function initUse (Vue: GlobalAPI) {
  Vue.use = function (plugin: Function | Object) {
    const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
    if (installedPlugins.indexOf(plugin) > -1) {
      // 插件 use 多次无效
      return this
    }

    // additional parameters
    // 获取 Vue.use(plugin, {}) 其他参数
    const args = toArray(arguments, 1)
    // 保证插件的第一个参数是 Vue 的构造函数实例
    args.unshift(this)
    // 如果插件中定义了 install 方法，则直接执行 install 方法
    if (typeof plugin.install === 'function') {
      // 调用插件的 install 方法
      plugin.install.apply(plugin, args)
    // 反之，如果没有定义，则把插件直接当作 install 来执行
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args)
    }
    installedPlugins.push(plugin)
    return this
  }
}
