---
title: React dependency & useMemo hook 用法
date: 2024-04-25 09:51:04
tags:
- React
- javascript
- object is
- useMemo hook
- react hooks dependency
---

{% include_md %}

React Hooks 依據不同需求開發出的 Hooks，不管是 `useEffect`、`useMemo`、`useCallback` 等等都提供了第二參數**dependency**來控制「觸發鉤子的時機」，本篇特別說明依賴應用上自己混淆的地方，順一下思維邏輯上打結的點：
<!-- more -->

# dependency 的背後運作機制
當指定的資料放進 dependency array 時，會告訴 React 啟動 `Object.is()` 比對前後資料，經判定有改變後 Hooks 內的程式碼片段就會被執行。
`Object.is()` 的比對思維類似於 `===` 強行別比對，關鍵的差異點在於以下情況：

- `-0` 與 `+0` 在`===` 認定相同 ，`Object.is()` 認定不同．
- `NaN` 與 `NaN` 在 `Object.is()` 認定相同，`===` 認定不同．

<iframe height="300" style="width: 100%;" scrolling="no" title="Object.is()" src="https://codepen.io/mawchu/embed/BaEMMBr?default-tab=js%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/mawchu/pen/BaEMMBr">
  Object.is()</a> by Jamie Hsieh (<a href="https://codepen.io/mawchu">@mawchu</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## dependency 認定物件型別參考
`Object.is()` 比對物件時會根據**記憶體位置**判定「複製參考」的一律視為相同，重新賦值一個物件 `= {...}` 或者修改參考 `Aobj = Bobj` 才會觸發 React 重新渲染，使用指象型運算符號例如 `[]` 或者 `.` 都只會修改相同參考的內容，並不會觸發 React 重新渲染！

## 當 dependency 為空
若 dependency array 為空陣列，除了既定的第一次 component render 會觸發以外，該鉤子涵式將不會再被執行或者進行運算，適用時機列舉如：

- 事件綁定監聽器。
- 複雜運算會占用效能、又不需要跟隨每一次的渲染時。
- API 呼叫取資料後的複雜運算，需要搭配業務邏輯判斷。

> 最好記的方式就是將**dependency 為空的**行為與 Vue 框架裡的 **`mounted()`** 生命鉤子思維邏輯視為類似、React hooks 中的 **return funciton** 與 Vue 框架裡的 **`destroy()`** 生命鉤子思維邏輯視為類似，會比較好理解一些。

# React useMemo() hooks 的應用
承襲以上說明的「複雜運算會占用效能」議題，當運算邏輯龐大時使用 useMemo hook 來凍結、限制依賴的 dependency 作為觸發依據以及條件，有時候也可以動態切換渲染的子元件，十分好用：

```
import React, { useMemo } from 'react';

const MyComponent = ({ condition }) => {
  // Memoize the component based on the condition
  const memoizedComponent = useMemo(() => {
    if (condition) {
      return <ComponentA />;
    } else {
      return <ComponentB />;
    }
  }, [condition]);

  return memoizedComponent;
};
```

在 Vue 框架裡的寫法：

```
<template>
  <component :is="dynamicComponent"></component>
</template>

<script>
export default {
  data() {
    return {
      dynamicComponent: 'ComponentA' // Default component
    };
  },
  watch: {
    condition(newValue) {
      this.dynamicComponent = newValue ? 'ComponentA' : 'ComponentB';
    }
  },
  props: {
    condition: Boolean
  }
};
</script>
```

## useMemo hook 教學影片
在我看過許多坊間的教學文章都有隔靴搔癢之感，有的敘述用來快取元件本身、有的敘述用來監聽變化，對於 React 新手很難快速抓出使用的時機。
以下影片透過龐大的陣列資料來示範複雜或者昂貴的運算成本對於使用體驗的傷害，以及使用 `useMemo` 的優化怎麼做到的：

<iframe width="560" height="315" src="https://www.youtube.com/embed/vpE9I_eqHdM?si=OZ42fToU5OnNrXux&amp;start=436" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

### useMemo 影片精華
- 當元件經常重新渲染，資料繁雜時適合使用以減少渲染。
- 當資料不需要重新運算，只需要回傳上一次的值就好。
- YT 溫馨小提醒，使用 useMemo 時記得將相關的依賴(dependency)加入陣列中，否則會被 useMemo 無視。

個人認為 useMemo 很像 Vue `computed()` 的概念，只是 Vue 已經幫你監聽好函式內相關聯的所有資料了，類似的原因在於：
- 會回傳一個值。
- 運算式內依賴的資料會自動更新。

> 需要注意的是 `useMemo`、`useCallback` 等鉤子雖然能帶來效能上的優化，一方面也是拖慢首次渲染的雙面刃，應用上需要評估。

# 心得
曾經在某個評論區看到一個說明：React 就像手排需要自己掌握邏輯；Vue 就像自排幫你規範好操作框架，所以學習 React 必須小心行駛、注意安全。