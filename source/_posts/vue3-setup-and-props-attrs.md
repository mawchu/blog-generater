---
title: 關於 Vue3 Setup X Attrs 傳入 props 行為的小坑
date: 2025-04-10 12:07:09
tags:
  - Vue3
  - Composition Api
  - Vue setup
  - Props
  - Attrs
categories: Vue
---

{% include_md %}
你以為的 `V-bind="$attrs"` 真的是你以為的那樣嗎？要不要點開我瞧瞧？
<!-- more -->

# 背景該要

公司近期在落實一項措施：包裝 **element UI** 組件以暴露內部共用方法，並重新命名為公司限定組件。
在開發功能 Monorepo 的過程發現 `el-upload` 組件從外部傳入 `before-remove` 方法後卻沒有被觸發，進入文件查看也確實透過 `V-bind="$attrs"` 將 props 全開了，跟兩三個同事討論許久都認為這個理解合理，那麼是哪裡出了問題呢？

## 打包 Upload 文件

```vue
<script setup>
...

import { Upload } from 'element-ui';
import 'element-ui/lib/theme-chalk/upload.css';

// 被定義成 props
const props = defineProps({
  ...
  beforeRemove: {
    default: null,
    type: Function
  },
  ...
})
...
</script>
<template>
  <div v-if="condition">
    <Upload
      v-bind="$attrs"
      ...
      :before-remove="beforeRemove"
    >
    </Upload>
  </div>
  <div v-else>
    <Upload
      v-bind="$attrs"
      ...
    >
      <!-- 本次應用到的元件邏輯在此，但少傳了 “:before-remove="beforeRemove" -->
    </Upload>
  </div>
</template>
```

## 語法糖 Vue Attrs

Attrs 是方便組件傳遞的時候「門戶大開」，你敢傳我就敢收！定義可以參考[Vue 官方文件](https://cn.vuejs.org/guide/components/attrs)
所以這次的困難點在於自己的思想爭鬥上：明明已經全開了卻還是收不到，究竟卡在哪？

### 官方解釋

> “透传 attribute”指的是传递给一个组件，却没有被该组件声明为 props 或 emits 的 attribute 或者 v-on 事件监听器。

### ChatGpt

#### Attrs 適用傳遞未聲明的 props

> attr 不是應該會對外層傳入的 props 照單全收？

> 在 Vue 2 Composition API（或 Vue 3）中，attrs 確實應該會自動接收所有未定義為 props 的外部屬性，但有幾種情況可能影響其行為：

##### attrs 的正常行為
   如果父元件傳入了一些 `props`，但子元件 **沒有明確定義** 這些 `props`，這些屬性會自動被放入 attrs，並且可以通過 `v-bind="$attrs"` 傳遞給內部元素：

  ```vue
  <!-- Parent.vue -->
  <template>
    <Child custom-attr="hello" />
  </template>

  <!-- Child.vue -->
  <template>
    <div v-bind="$attrs">I'm a child component</div>
  </template>

  <script>
  import { defineComponent } from 'vue';

  export default defineComponent({
    inheritAttrs: false, // 這個選項會影響 attrs（詳見下面）
    setup(props, { attrs }) {
      console.log(attrs); // { "custom-attr": "hello" }
    },
  });
  </script>
  ```

  在這裡，因為 custom-attr 不是 props，所以它會自動被放入 $attrs。

##### inheritAttrs: false 影響 $attrs
  Vue 2.7+ 和 Vue 3 提供了 inheritAttrs: false，當設定為 false 時：

  - $attrs 仍然存在，但不會自動綁定到最外層元素。
  - 你需要手動用 `v-bind="$attrs"` 綁定到某個子元素。

  如果你沒有 `inheritAttrs: false`，Vue 會自動把 `attrs` 綁定到最外層元素。

##### props 會影響 $attrs

如果子元件 **有定義相應的 props** ，那麼這些 props **不會進入 $attrs** ，因為它們已經被 Vue 處理為 props。

> 這是因為 `v-bind="$attrs"` 只會綁定「非 props 屬性」，而 before-remove 是 Upload 元件的 props，所以不會自動進入 $attrs。

> 但 Element Plus 的 <Upload> 元件明確定義了 before-remove 為 props，因此 Vue 不會把它放進 $attrs。

```vue
<!-- Parent.vue -->
<template>
  <Child custom-attr="hello" defined-prop="world" />
</template>
<!-- Child.vue -->
<template>
  <div v-bind="$attrs">I'm a child component</div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  props: ["definedProp"], // custom-attr 會進入 attrs，但 defined-prop 不會
  setup(props, { attrs }) {
    console.log(props); // { definedProp: "world" }
    console.log(attrs); // { "custom-attr": "hello" }
  }
});
在這種情況下：

- `defined-prop` 作為 `props`，不會進入 `$attrs`。
- `custom-attr `沒有對應的 `props`，所以進入 `$attrs`。
</script>
```

這一點恰恰就是本次遇到的「**有定義相應的 props** ，那麼這些 props **不會進入 $attrs**」，也就是說需要手動將被定義相應的 props 給綁定上 `<Upload></Upload>`。

#### 為什麼 $attrs 不包含 props？
在 Vue 2 / Vue 3 中，`$attrs` 只會收集「未在 props 定義的屬性」，例如：

```js
export default {
  props: ["accept", "autoUpload", "drag"],  // 這些 props 不會進入 $attrs
  setup(props, { attrs }) {
    console.log(attrs);  // 只包含未定義的 props，例如 class, id, data-* 屬性
  }
};
```
這意味著：

- `props.autoUpload`、`props.accept`、`props.drag` 不會進 `$attrs`。

- 但 任何其他非 `props` 的 HTML 屬性（例如 class、id、data-*）會進 `$attrs`。

##### v-bind="$attrs" 只適用於 HTML 屬性

如果 $attrs 包含的屬性是事件（例如 `@click`），它只會綁定到 **能夠接收事件的標籤** 。

```vue
<template>
  <button v-bind="$attrs">Click me</button>
</template>
```

這樣 `$attrs` 中的 `onClick` 事件才能被 <button> 接收。
但如果 `$attrs` 綁定在 `<div>` 上，某些事件可能不會生效，因為 div 本身不處理某些特定的事件類型。

#### setup 語法糖

> 是否在 template 裡撰寫 **可以省略 `props`**

> 在 Vue 2 Composition API（Vue 2.7+ 或使用 @vue/composition-api）和 Vue 3 中，你不能在 <template> 直接使用 `props` 而不在 `setup()` 明確定義。

> 目前使用的是 `<script setup>`

> 在 Vue 3 `<script setup>` 語法 中，props 可以直接在 `<template>` 使用，不需要手動 return，因為 **Vue 會自動解包 props！✅

#### props 可以直接在 <template> 使用

不需要手動 return，因為 `defineProps()` 會自動讓 props 在 <template> 可用。
這是 <script setup> 的特性，和 Options API、普通 Composition API 不同。

```vue
<script setup>
defineProps(["someProp"]);  // 直接定義 props
</script>

<template>
  <div>{{ someProp }}</div>  <!-- ✅ 直接使用，不需要 return -->
</template>
```

以上是這次學習到的兩個應注意而未注意的重要小細節！！！
1. 未明確為 `defineProps` 定義的對象，才能為 `$attrs` 所捕捉！
2. <script setup> 已經直接將 props 解包！可以直接使用而不需要 `props.attr`。