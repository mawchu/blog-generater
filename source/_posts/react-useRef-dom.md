---
title: React useRef X DOM 操作實例
date: 2024-05-06 11:48:51
tags:
- React
- React hooks
- useRef
- Javascript
- Event.stopPropagation
categories:
- React
- Book learning
---

{% include_md %}

# 尋常的 Javascript DOM 操作在 React 會失敗
`useRef` 最常見的做法就是用來 DOM 操作，尋常的 Javascript DOM 操作為什麼不起作用呢？這是因為初始化的元件必須在第一次的 return render function 渲染後才會存在 DOM，也才能被選擇、操作，Javascript 基本用法 `querySelector`、`getElementById` 都需要 DOM 已經生成為前提。
<!-- more -->
# 利用 useRef 保持參考的特性存取 DOM
由於 `useRef` 可以不受限於渲染迭代階段，即便每一次的渲染無論在 React 啟動了 **diff 機制** 刪改或保留真實 DOM 後，都能以渲染為最小時間單位重新綁定參考或者維持參考，這也解釋了為什麼該 hook 能夠幫助開發者追蹤 DOM 並且持續取得值或者綁定事件。

該鉤子的命名也能很自然與 Vue 的 `$refs` 應用與連結。

# useRef DOM 的範例
以下範例提出開發介面經常遇到的情境：給 Element 增加高度伸縮動畫，但內容有長有短而 **transition 無法知道高度 (Height) `auto` 的值導致動畫失效** 的情境。工作上踩過幾次坑印象深刻　(๑´ㅂ`๑)。

這時候就需要借助 Javascript 取得實際高度 `auto` 的值時做出絲滑的動畫。

<iframe height="300" style="width: 100%;" scrolling="no" title="React.useRef X DOM - Collapse" src="https://codepen.io/mawchu/embed/QWPeOdx?default-tab=js%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/mawchu/pen/QWPeOdx">
  React.useRef X DOM - Collapse</a> by Jamie Hsieh (<a href="https://codepen.io/mawchu">@mawchu</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

這個範例實做了幾個經常應用的使用體驗：

## useRef 指向參考以綁定 DOM 元素
[這一篇有詳細說明]()

## 利用陣列管理列表狀態
想要達到其中一個元件打開、其他的關閉時就可以針對陣列的每個獨立參考來控制，先關閉所有的元件、再針對特定元件打開也可以節省跑回圈的演算效能(Big O)，

## 父元件綁定事件需要為子元件忽視
結合兩個做法達成目的：

- 父元件達成點擊子元件以外範圍、關閉全部子元件。
- 子元件設定 `e.stopPropagation()` 來阻止事件冒泡。

## vue 版本的寫法

- 父元件達成點擊子元件以外範圍、關閉全部子元件。
```js
<template>
  <div class="wrapper" @click="handleParentClick">
    <Collapse
      v-for="(collapse, index) in collapseItems"
      :key="index"
      :label="collapse.label"
      :isOpen="isOpenList[index]"
      @toggle="handleToggle(index)"
    >
      {{ collapse.children || 'Default text...' }}
    </Collapse>
  </div>
</template>

<script>
import Collapse from './components/Collapse.vue'; // Assuming Collapse component is defined in a separate file

export default {
  data() {
    return {
      collapseItems: [
        {
            label: "Happy day",
            children: <>
            <strong>I'm the children text.</strong>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. A ducimus consectetur obcaecati sunt quaerat quam odio pariatur hic molestiae repellat?</p>
            </>
        },
        {
            label: "Show content!",
            children: null // If content is null, Collapse component will render without children
        }, 
        {
            label: "🥰",
            children: null
        }
      ],
      isOpenList: Array(3).fill(false) // Initialize isOpenList with false values
    };
  },
  methods: {
    handleToggle(index) {
      // This method is called when a child component is toggled
      // We'll ignore the toggle action in this parent component
    },
    handleParentClick() {
      // This method is called when the parent component is clicked
      // Perform actions specific to the parent here
      this.isOpenList = Array(this.collapseItems.length).fill(false);
    }
  },
  components: {
    Collapse
  }
};
</script>
```

- 子元件設定 `e.stopPropagation()` 來阻止事件冒泡。
```js
<template>
  <article class="py-2">
    <button class="rounded-lg bg-amber-200 px-2 py-1 my-2 font-semibold relative z-10" @click="handleClick">
      {{ label }} <i :class="isOpen ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down' "></i>
    </button>
   
    <div class="content-wrapper -translate-y-6" :style="{ height: isOpen ? parentHeight + 'px' : '0px' }" ref="parentRef">
      <div class="content border-2 border-grey-600 w-[calc(100%-12px)] sm:w-2/3 px-3 py-4 ml-2 relative">
        <slot></slot>
      </div>
    </div>
  </article>
</template>

<script>
export default {
  props: {
    label: String,
    isOpen: Boolean
  },
  data() {
    return {
      parentHeight: 0
    };
  },
  methods: {
    handleClick(e) {
      e.stopPropagation(); // Prevent click event from bubbling up to the parent component
      this.$emit('toggle');
    }
  },
  mounted() {
    // Get the height of the content div after it's rendered
    this.parentHeight = this.$refs.parentRef.scrollHeight;
  }
};
</script>

<style scoped>
/* Add your component-specific styles here */
</style>
```
### 修飾符（Event Modifiers）
阻止事件冒泡也可以用 Vue 提供的 **修飾符（Event Modifiers）** 來完成：
詳細可以[參考 Kuro 大大這篇](https://book.vue.tw/CH1/1-5-events.html#v-on-%E8%88%87%E4%BF%AE%E9%A3%BE%E5%AD%90)。
> `.stop` 的作用就如同大家熟知的 `event.strpPropagation()`，用來阻止事件冒泡。

<br />
```js
<template>
  /* 修飾符寫法 */
  <article class="py-2" @click.stop="handleClick"> 
    ...
  </article>
</template>

<script>
export default {
  ...
  methods: {
    handleClick() {
      this.$emit('toggle');
    }
  },
  ...
};
</script>
```