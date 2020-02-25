### Vue 中组件通信方式

#### Vue 中组件之间存在哪几种关系?

* 父子组件

* 兄弟组件（同一个父组件）

* 隔代（跨层）组件（如爷爷和孙子）

#### 通信方式

* prop

> 父组件通过 props 向子组件传值

* 自定义事件：$emit, $on

> 子组件通过 $emit 事件给父组件发送消息，父组件通过 $on 监听该事件

* EventBus

> 通过 Vue 实例构造一个事件中心，再利用 $emit, $on 去派发和监听事件，这种方式适用于 父子组件，兄弟组件，隔代组件 之间的数据传递

```javascript
import Vue from 'vue'
export const EventBus = new Vue()
```

* vuex：action（dispatch触发），mutation（commit触发），state（mutation中修改）

> vuex 实现了一个单向数据流，在全局拥有一个 `state` 存放数据，当组件要更改 `state` 时，必须通过 `mutation` 提交修改信息，`mutation`同时提供了订阅者模式供外部插件调用获取 `state` 数据的更新。异步操作（如调用后端接口异步获取数据）需要走 `action`，但 `action` 无法直接修改 `state`，需要通过 `commit` 一个 `mutation` 来修改 `state` 的数据。

更多关于 vuex 的内容可以看官方文档：[vuex](https://vuex.vuejs.org/zh/guide/)

* 边界情况

  - $root

  > 访问根实例，不推荐直接使用

  - $parent

  > 访问父组件实例，不推荐直接使用

  - $children

  > 访问子组件实例

  - $refs

  > 操作组件 dom，只有在组件渲染完成（$mount）之后才可以访问到

  - provide/inject

  > 一种依赖注入的方式，一般在组件库中会使用，跨层级注入数据，如 Element-UI 中就用到

* 非 prop 的特性

  - $attrs

  > `$attrs` 里存放的是父组件中绑定的非 `props` 属性

  - $listeners

  > `$listeners` 里存放了父组件中绑定的非原生事件

* Element-UI 中 emitter

  > element 中将 vue1 的 dispatch 和 broadcase 自己实现了下

#### props

父 -> 子

```
props: {
  data: {
    type: Object,
    required: true
  }
}

<Table :data="data" />
```

**注意： JavaScript 中对象和数组是通过引用传入的，所以对于一个数组或对象类型的 prop 来说，在子组件中改变这个对象或数组本身将会影响到父组件的状态。**

#### 自定义事件

子 -> 父

```
<el-button @click="handleClick()">点击</el-button>

在ElButton组件中

this.$emit('click', evt);
```

**注意：不同于组件和 prop，事件名不存在任何自动化的大小写转换。而是触发的事件名需要完全匹配监听这个事件所用的名称。Vue 中推荐使用 `kebab-case` 类型的事件名。**

#### 事件总线

组件 -> 组件

```
利用 Vue 初始化事件实例

import Vue from 'vue'
export const EventBus = new Vue()

EventBus.$emit('event-name, data); // 触发事件

// 监听事件
EventBus.$on('event-name', function (data) {
  // Use data to do something
};
```

#### Vuex

见 [Vuex API](https://vuex.vuejs.org/zh/guide/)

#### $root / $parent

组件 -> 组件：兄弟组件之间通过父辈组件搭桥进行通信，不推荐直接使用，可以用 vuex 代替

```
this.$parent.$emit('event-name', data);

this.$parent.$on('event-name', function (data) {
  // Do something
});
```

#### $children

子组件：父组件通过 `$children` 访问子组件。

**注意：$children 并不保证顺序，也不是响应式的。**

#### $attrs / $listeners

* $attrs: 包含了父作用域中不作为 Prop 被识别 (且获取) 的特性绑定 ( class 和 style 除外)。当一个组件没有声明任何 Prop 时，这里会包含所有父作用域的绑定 ( class 和 style 除外)，并且可以通过 v- bind="$attrs" 传入内部组件——在创建高级别的组件时非常有用。

```
// Parent 有 100 个属性需要绑定
<Parent :prop1="data1" :prop2="data2" ... />
=>
<Parent :prop1="data1" :extra="extraData" />

// 子组件只声明一个 prop
props: ['prop1'];

// 那么剩余的没有声明的 prop 通过 $attrs 可以访问到
```

**注意：inheritAttrs 为 false 时，可以设置组件不继承非 Prop 特性。**

* $listeners: 包含了父作用域中的 (不含 .native 修饰器的) v-on 事件监听器。它可以通过 v-on="$listeners" 传入内部组件——在创建更高层次的组件时非常有用。

```
Parent组件内：<child1 v-on:event1="onEvent1" @event2="onEvent2" />

Child1组件内：<child2 v-on="$listeners" />

Child2组件内：当某个方法（事件）执行后，可以通过 `this.$emit('event2')` 触发 Parent 组件内的 event2 事件
```

#### refs

可以获取所有注册过 ref 属性的 Dom 节点或者组件实例

#### provide / inject

依赖注入方式：祖先组件 -> 后代组件

```
// 祖先
provide: function () {
  return {
    getMap: this.getMap
  }
}

// 后代组件
inject: ['getMap']
```

### Element-UI 中 emitter

模拟了 Vue 1 中的 dispatch 和 broadcast 实现

```javascript
function broadcast(componentName, eventName, params) {
  this.$children.forEach(child => {
    var name = child.$options.componentName;

    if (name === componentName) {
      child.$emit.apply(child, [eventName].concat(params));
    } else {
      broadcast.apply(child, [componentName, eventName].concat([params]));
    }
  });
}
export default {
  methods: {
    dispatch(componentName, eventName, params) {
      var parent = this.$parent || this.$root;
      // 组件需要设置 componentName 属性，类似 name
      var name = parent.$options.componentName;

      // 递归寻找指定 componentName 的 父级
      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent;

        if (parent) {
          name = parent.$options.componentName;
        }
      }
      if (parent) {
        parent.$emit.apply(parent, [eventName].concat(params));
      }
    },
    broadcast(componentName, eventName, params) {
      broadcast.call(this, componentName, eventName, params);
    }
  }
};

```