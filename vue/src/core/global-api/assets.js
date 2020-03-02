/* @flow */

import { ASSET_TYPES } from 'shared/constants'
import { isPlainObject, validateComponentName } from '../util/index'

export function initAssetRegisters (Vue: GlobalAPI) {
  /**
   * Create asset registration methods.
   */
  // ASSET_TYPES = [ 'component', 'directive', 'filter' ]
  ASSET_TYPES.forEach(type => {
    // Vue.component()
    // Vue.directive()
    // Vue.filter()
    Vue[type] = function (
      id: string,
      definition: Function | Object
    ): Function | Object | void {
      // 用户没有指定对应的 function 方法或者对象
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if (process.env.NODE_ENV !== 'production' && type === 'component') {
          validateComponentName(id)
        }
        // Vue.component('', { data: {}, template: '' })
        if (type === 'component' && isPlainObject(definition)) {
          // 定义组件 name
          definition.name = definition.name || id
          // extend 用来创建组件构造函数, definition 是组件的构造函数
          definition = this.options._base.extend(definition)
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition }
        }
        this.options[type + 's'][id] = definition
        return definition
      }
    }
  })
}
