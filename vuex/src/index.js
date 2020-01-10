import { Store, install } from './store'
import { mapState, mapMutations, mapGetters, mapActions, createNamespacedHelpers } from './helpers'

export default {
  Store,
  install,
  version: '__VERSION__',
  // 导出辅助函数
  mapState,
  mapMutations,
  mapGetters,
  mapActions,
  // 创建基于命名空间的组件绑定辅助函数
  createNamespacedHelpers
}
