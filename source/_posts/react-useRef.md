---
title: React - useRef & useState 比較
date: 2024-05-03 10:33:36
tags:
- React
- React hooks
- useRef
- useState
- React 思維進化
categories:
- React
- Book learning
---

{% include_md %}
useRef 的參考遺世獨立、useState 跟隨元件的興亡。
<!-- more -->

雖然在 React 的框架中的一貫宗旨是 Immutable Update，強調每次的渲染都需要根據**「新的參考」**變化才會觸發，但有些特殊情況是依賴舊的參考來運作的，需要應用到 Mutable value 追蹤與更新值，但不需要重新渲染畫面，useRef 顧名思義就是使用「參考」該值與元件生命週期脫鉤不受渲染影響、創造的可變值(Mutable Value)也不會觸發渲染。

# useRef 的應用場景
`useRef()` 會創建一個僅包含 `currenct` property 的 Javascript 物件，讓你在跨渲染之間保持參考，得益於此特性延伸的幾個應用場景：

## 非同步取得更新的值
在元件中使用異步事件(Asynchronous)例如 **SetTimeout** 等 Web API 時若使用 `useState` 很可能會重複取得當下版本的 State，而且 SetTimeout 本身也會被重建，這是由於每一個渲染的元件版本中跟隨的資料都是 **凍結的(Freezed)** 、沒有辦法即時更新理想的值，這時候 useRef 就派上用場了。

<iframe height="300" style="width: 100%;" scrolling="no" title="React.useRef" src="https://codepen.io/mawchu/embed/qBwzmQB?default-tab=js%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/mawchu/pen/qBwzmQB">
  React.useRef</a> by Jamie Hsieh (<a href="https://codepen.io/mawchu">@mawchu</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

>若在範例中註解 SetStateCount 的執行會停止渲染，因為 SetState 是觸發元件渲染的唯一方式與途徑。

### useState 的值跟隨每一次的渲染
`useState` 與 `useRef` 最大的不同在於 `useState` 與渲染的時序是綁定的，《React 思維進化》一書有提到渲染版本的 **凍結(Freezed)** 歸因於 Javascript 閉包的設計，將當下的渲染封閉成一個時空停止的宇宙，該範圍內的所有工作階段雖然都會被執行，但運算結果須要到下一次渲染才能取得，稱為 **Batch Update(階段性更新)**  React 會在該次渲染工作階段都執行完畢，才會將結果一併反映在這次渲染中．這其中元件範圍內的工作階段內的資料都被 **凍結(Freezed)** 。

所以上述範例才會看到 `console.log('stateCount', stateCount)` 總是落後一次，更新後的值必須在下一次渲染的工作階段才得取得。

> 可以修改 ref.current 属性。与 state 不同，它是可变的。然而，如果它持有一个用于渲染的对象（例如 state 的一部分），那么就不应该修改这个对象。Ｓ
> 改变 ref.current 属性时，React 不会重新渲染组件。React 不知道它何时会发生改变，因为 ref 是一个普通的 JavaScript 对象。
> 除了 初始化 外不要在渲染期间写入或者读取 ref.current否则会使组件行为变得不可预测。
>https://zh-hans.react.dev/reference/react/useRef

官方文件有提到  應該避免與渲染相關的 `state` 混用，並建議僅在初始化時使用否則可能會不如預期。

### useRef 不用等候渲染就可以讀取或即時更新
[YT 大佬](https://youtu.be/42BkpGe8oxg?si=OAO_lLa4ha8CMp-j&t=48)解釋的超級精闢：
> UseRef does not trigger the re-render of the component, and ref values are **not used in the return body of the actual component**.
> UseRef are used for the values that are not needed for the rendering.
> Ref would allow you to make update and to **read the updated value instantly without waiting re-render**.

<br />
所以 UseRef 本來就不會被應用在渲染中，它只是提供你取得最新資料的值。

### 除了操作 DOM 還可以用在哪裡
>There are several scenarios where you might **need a value to persist across renders** without causing the component to re-render when the value changes. The useRef hook is well-suited for these scenarios:

- 保持前一個狀態值提供比對
例如表單的填寫參照。
> **Preserving Previous State:** Sometimes, you need to preserve the previous state or value for comparison purposes. For example, in a form where you want to compare the current input value with the previous value to determine if there are any changes.

#### 避免重複龐大計算
- 控制計時器、動畫與保持外部函式庫的實體
    計時器的非同步照邏輯是不應與渲染工作階段綁定的，而外部函式庫建立的實體也不太需要跟隨渲染變動，還有連續性的洞化等等。
    > **Managing Imperative Actions:** If you need to perform imperative actions or operations that don't affect the component's UI directly but rely on persistent values, useRef can be useful. Examples include managing animations, timers, or maintaining references for external libraries.

- 複雜運算不用依賴每次渲染時
    當一個計算邏輯龐大複雜又只需要執行一次，元件渲染也僅僅是讀取其結果時。
    > **Optimizing Performance:** In some cases, recalculating certain values or initializing complex data structures on every render can be computationally expensive. Storing such values using useRef can optimize performance by avoiding unnecessary recalculations.

- 快取昂貴的計算成本或避免複雜元件渲染
    這跟前面幾點講到的類似。
    > **Caching Expensive Computations:** If your component performs expensive computations or data fetching operations, you can use useRef to cache the result so that it doesn't need to be recomputed on every render unless necessary.

#### 減少渲染
- 避免經常更動的資料造成元件樹不必要的渲染
    某些值應用到的元件很多或者子孫代很長時，不依賴元件的 `prop` 或者 `state` 時可以使用以減少渲染。
    > **Avoiding Unnecessary Re-renders:** Certain values may change frequently but don't need to trigger re-renders of the entire component tree. By storing such values in useRef, you ensure that changes to those values don't cause unnecessary re-renders.

#### 前後資料比較
- 保持前一個狀態值提供比對
    例如表單的填寫參照。
    > **Preserving Previous State:** Sometimes, you need to preserve the previous state or value for comparison purposes. For example, in a form where you want to compare the current input value with the previous value to determine if there are any changes.

#### 需要控制次數的計數器
- 不用依賴資料變化的事件監聽器
    畢竟大部分應用 `UseRef` 的場景還是在操作 DOM 上，所以綁定事件監聽器應用十分合理就不多贅述．
    > **Event Handlers:** Storing event handler functions using useRef can be beneficial, especially when those handlers don't depend on any state or props and don't need to trigger re-renders.

    當資料不用依賴 `prop` 或者 `state` 取得時，只是靜態讀取參考的值時可以考慮使用，不過這都取決於當前的業務邏輯才能定奪。
    >In essence, useRef is a versatile hook that allows you to manage mutable values that persist across renders without triggering re-renders. It's particularly useful in scenarios where you need to manage state-like behavior for values that are not part of your component's state or props.
    > By ChatGpt

- 根據次數控制動畫
    有的情境需要


# 在 React 的世界裡 useState 是觸發渲染的唯一解
React 觸發渲染目的不外乎是反應資料的變化並且一律重繪，《React 思維進化》直截了當表示 `SetState` 是觸發渲染的唯一解，好奇的我就反推那麼市面上熱門好用的幾個資料管理套件如 useReducer、zustand 背後機制是否也基於 `SetState` 觸發渲染呢?

> Both useReducer and Zustand (or any state management library for React) ultimately rely on useState under the hood, albeit indirectly or abstracted away from the user.

> The same principles apply to state management libraries like Jotai and Recoil. These libraries also leverage React's core useState hook under the hood while providing additional features and abstractions for managing global state in React applications.

> By ChatGpt

可以推斷很多好用的延伸套件也都是基於 React 提供的 hooks 來建構與開發更靈活的工具。