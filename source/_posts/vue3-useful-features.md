---
title: Vue3 - useful features 實用工具解析
date: 2024-08-14 14:34:02
categries: Vue3
tags:
- Vue3
- WatchEffect
- defineProps
- withDefaults
- attrs
- useVModel
- defineModel
---

{% include_md %}
本篇重點說明 Vue3 幾個好用的語法糖，包涵
<!-- more -->

又來到填坑的好時機了，這篇來重點介紹一下 Vue3 釋出的幾個好用的小工具來加快業務邏輯開發的效率，也可以更靈活的擴大 props 的應用，快來瞧瞧吧!

<img style='margin-right: unset; margin-left: unset; padding-top: 30px' class="post-img" src='https://images.pexels.com/photos/1543793/pexels-photo-1543793.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' title="https://www.pexels.com/" height='auto'>


# WatchEffect
該函式範圍內的依賴（Dependency）都會被直接偵測到並且觸發副作用，不需要特地撰寫 `immediate: true` 、 `deep: true` 與指定依賴（Source），大大的助益了多個依賴時的維護度。
>`watchEffect` only tracks dependencies during its synchronous execution. When using it with an async callback, only properties accessed **before the first await tick** will be tracked.
同步執行的程式才會追蹤依賴（Dependency）變化，若以非同步形式 `async` 撰寫 Callback 則第一個 `await` 之前被監聽的依賴（Source）才會被追蹤。

<iframe height="300" style="width: 100%;" scrolling="no" title="Vue3 - watchEffect &amp; async function" src="https://codepen.io/mawchu/embed/KKjZwaX?default-tab=js" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/mawchu/pen/KKjZwaX">
  Vue3 - watchEffect &amp; async function</a> by Jamie Hsieh (<a href="https://codepen.io/mawchu">@mawchu</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>
簡而言之就是包含了以下額外配置的用法： 
1. `immediate: true`
2. `deep: true`
3. 多重 source 監聽

## watchEffect v.s. Watch
> **Watch is lazy by default:** the callback won't be called until the watched source has changed.
watch 若沒有指定 `immediate: true` 則第一次的創造 watcher 時不會觸發，mounted 階段則沒有改變。
watchEffect 會自動在第一次就監聽到變化，可以節省撰寫 immediate 或者 mounted 額外執行第一次的行為，另外重要的一點是 watchEffect 只追蹤 Callback 觸及的 Source。

# Component features
## defineProps & withDefaults
[defineProps 官方文件](https://cn.vuejs.org/guide/typescript/composition-api.html#typing-component-props)
應用上主要為了解決型別的定義(Typescript)而產生。

### defineProps
定義 props 的型別小工具，基礎用法。

```js
const props = defineProps({
  buttonType: {
    type: String,
    default: 'default', // default, pending, complete, rejected
  },
  textColor: {
    type: String,
  },
  ...
});

```

### withDefaults
處理解構後的預設值(default props)，可以清楚分開定義型別與預設值，搭配 `defineProps` 的進階用法。
```js
const props = withDefaults(
  defineProps<{
    dataTestId?: string | number;
    activeCollapse: string;
    backgroundColor?: string;
    headerHeight?: number;
  }>(),
  {
    dataTestId: 'link',
    activeCollapse: '0',
    backgroundColor: '#fff',
    headerHeight: 48,
  }
);

```

## attrs & v-bind
[attrs 官方文件](https://cn.vuejs.org/guide/components/attrs)
`attr` & `v-bind` 是全開 props 的雙刀流，當使用三方 UI 套件時不限制元件的 props 資料可用，父元件傳的資料全盤接收到子元件上，擴展使用靈活度。
1. 使用 useAttrs() API 取得所有 props attributes。
2. 將元件 v-bind 傳入資料。
```js
<script setup>
import { useAttrs } from 'vue'

const attrs = useAttrs()
const getBindValues = computed(() => ({
  ...attrs,
  otherData: 'other props'
}))
</script>
<template>
  <el-component v-bind="getBindValues"></el-component>
</template>
```
## useVModel
[useVModel 官方文件](https://github.com/vueuse/vueuse/blob/main/packages/core/useVModel/index.ts)
> Shorthand for v-model binding, props + emit -> ref
我的理解是讓元件 `props` & `emit` 也能落實 `V-model` 的雙向綁定效果，省略事件綁定的 boilerplate。

### 不使用 useVModel
需要撰寫完整的監聽事件與 emit 方法。
```js
<template>
  <input :value="modelValue" @input="onInput" />
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

function onInput(event) {
  emit('update:modelValue', event.target.value)
}
</script>
```

### 使用 useVModel
是需要透過 `@vueuse/core` 漸進式導入的額外工具
```bash
import { useVModel } from '@vueuse/core'
```
useVModel 在 `@vueuse/core` 有單一資料與 multiple 資料(useVModels 就是 useVModel loop)可以使用， 以 v-model 形式撰寫雙向資料綁定：

### 參數列表

1. `props` 為父元件傳遞的 `defineProps()` 資料串
2. `key` 為 `props[key]` 的值，選擇需要綁定的 prop 資料
3. emit 為子元件響應的 `defineEmits()` 對應事件 

> export function useVModel<P extends object, K extends keyof P, Name extends string>(
  props: P,
  key?: K,
  emit?: (name: Name, ...args: any[]) => void,
  options?: UseVModelOptions<P[K], false>,
): WritableComputedRef<P[K]>

```js
<template>
  <input v-model="inputValue" />
</template>

<script setup>
import { useVModel } from '@vueuse/core'
import { defineProps, defineEmits } from 'vue'

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const inputValue = useVModel(props, 'modelValue', emit)
</script>
```

## defineModel
[defineModel 官方文件](https://vuejs.org/api/sfc-script-setup.html#definemodel)
Vue 推出的 3.4 版本釋出的巨集(Macro)工具之一，不需匯入就可以使用，算是 V-model 在元件內的另一種進化版用法，常用在 **集合 Form inputs**。
> If you have a default value for defineModel prop and you don't provide any value for this prop from the parent component, it can cause a de-synchronization between parent and child components. 

文件有提醒記得在父元件提供預設值(default values)否則會導致父子元件資料不同步的問題。

### Component 子元件
定義一個 `defineModel` 對象並制定表單項目。

```js
<script setup lang="ts">
  ...
  interface IEmployee {
    name?: string;
    age?: number;
    salary?: number;
  }
  const model: ModelRef<IFruits> = defineModel({
    default: () => ({
      name: 'John Doe',
      age: 38,
      salary: 45000,
    }),
  });
</script>
<template>
  <div>
    <el-form
      :model="model" // ------------- 父層傳入的 v-model
      :rules="formRules"
      label-position="top"
      ref="formRef"
    >
      <el-form-item
        prop="name"
        :label="..."
      >
        <el-input
          v-model="model.name" // ---- input item
        ></el-input>
      </el-form-item>
      <el-form-item
        prop="age"
        :label="..."
      >
        <el-input
          v-model="model.age" // ---- input item
        ></el-input>
      </el-form-item>
      <el-form-item
        prop="salary"
        :label="..."
      >
        <el-input
          v-model="model.salary" // ---- input item
        ></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
```
### Parent 父元件
制定一樣規格的資料傳進子元件中並設定好預設值。
```js
<script setup lang="ts">
  ...
  const form = reactive({
    name: '',
    age: 0,
    salary: 0,
  });
</script>
<template>
  <Child
    v-model="form" // --------- 對應這裡的 form
    ref="formRef"
  />
</template>
```

## 比較 useVModel & defineModel
### useVModel
>- useVModel is a function that takes in the component's props and emits function, and it returns a reactive reference that can be bound to v-model.
>- abstracts away the need to manually emit the update:modelValue event.

從 VueUse(core) 外部引用的工具，提供給 Composition API 使用，取得元件的 props & emits 並且回傳一個 model 對象提供綁定，減少 update value 的 emit 事件制定步驟。

### defineModel
>- defineModel allows you to declare a v-model binding directly in the component’s props, making it explicit and simplifying the logic for handling model bindings.
>- It automatically handles the prop and event emission, reducing boilerplate code.

是官方釋出的巨集(Macro)的工具之一，允許在子元件直接雙向綁定省去處理 props & emits，Composition 與 Options APIs 都適用，會是一個比 useVModel 更簡潔的寫法，不過 useVModel 可以自定義更複雜的邏輯處理。