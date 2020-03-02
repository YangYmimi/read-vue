### Vue源码阅读 - 组件化实现

#### 源码阅读

```javascript

```

Vue.component方法做了什么？
  - global api
地址：initAssetRegisters(Vue) src/core/global-api/assets.js
作用：组件注册使用extend方法将配置转换为构造函数并添加到components选项

组件创建整体流程

new Vue({}) => $mount() => vm._render() => createElement() => createComponent()