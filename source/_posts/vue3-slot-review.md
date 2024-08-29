---
title: Vue3 - Slot usage 插槽使用說明
date: 2024-08-22 10:43:16
tags:
- Vue
- slot
categries: Vue
---

{% include_md %}
插槽就是個用了就忘的好工具，最近在整理 Vue3 專案的元件有點忘記插槽的用法了快快來複習。
<!-- more -->

# Slot usage 插槽使用說明
簡單說明一下插槽就像是開放的 **部分客製化空間** ，提供範圍內自由設計的 UI 可以像插槽一樣放入元件中，重新回顧一下重點：

## Default slot 預設插槽
插槽分為具名與不具名，不具名的插槽為預設使用的插槽，通常只能一個，可以替換掉原本的部分內容：

### Component 元件
```js
<script setup lang="ts">
import SvgIcon from 'Components/common/SvgIcon.vue';
import { withDefaults } from 'vue';

const attrs = useAttrs();
const props = withDefaults(
  defineProps<{
    svgIconName?: string;
    mode?: string;
  }>(),
  {
    mode: 'light',
    svgIconName: 'info',
  }
);

const calSvgIconName = computed(() => props.svgIconName);
const calMode = computed(() => props.mode);
const getBindValues = computed(() => ({
  width: 'auto',
  showArrow: true,
  persistent: false,
  popperClass: `popover-${calMode.value}`,
  ...attrs,
}));
</script>

<template>
  <el-tooltip v-bind="getBindValues" :offset="6">
    <template #default>
      <slot>  // --------------------- Default slot 開始
        <SvgIcon
          class="ml-1"
          v-if="calSvgIconName"
          :width="18"
          :height="18"
          :name="calSvgIconName"
          color="#e25827"
        />
      </slot> // --------------------- Default slot 開始
    </template>
  </el-tooltip>
</template>
```
### Parent 父層
預設不具名插槽是不限制非 `<template></template>` 形式放入，任何 Html 都可以為具名插槽所運用：
```js
...
<Tooltip :content="$t('common.statement.partnerTotalFTF')" placement="bottom">
    <span>這裡的內容會覆蓋 '<slot></slot>'</span>
</Tooltip>
```

## Naming slot 具名插槽
具名插槽的使用可以方便定義目的與位置，配合 UI Library 的應用或者客製化元件都可以很好的發揮，可以定義很多個：

### Component 元件
```js
...
<template>
  <el-tooltip v-bind="getBindValues" :offset="6">
    <template #default>
      <slot name="trigger"> // --------------------- Naming slot "trigger" 開始
        <SvgIcon
          class="ml-1"
          v-if="calSvgIconName"
          :width="18"
          :height="18"
          :name="calSvgIconName"
          color="#e25827"
        />
      </slot> // --------------------- Naming slot 結束
    </template>
    <template #content>
      <slot name="content"></slot> // --------------------- Naming slot "content"
    </template>
  </el-tooltip>
</template>
```

### Parent 父層
具名插槽會限制以 `<template v-slot:name></template>` 模式命名並插入內容：
```js
...
<Tooltip :content="$t('common.statement.partnerTotalFTF')" placement="bottom">
    <template v-slot:trigger>這裡的內容會覆蓋 '<slot name="trigger"></slot>'</template>
    <template v-slot:content>這裡的內容會覆蓋 '<slot name="content"></slot>'</template>
</Tooltip>
```
