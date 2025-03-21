---
title: React - useEffect hook 使用說明
date: 2024-05-02 10:35:10
tags:
  - React
  - React hooks
  - useEffect
  - class life cycle
  - mounted
  - updated
  - destroy
categories:
  - React
---

{% include_md %}
這一篇來記錄一下初學 React 時界定最模糊但最常用的鉤子 `useEffect()`，到底怎麼用、為什麼這樣用？

<!-- more -->

React 所有鉤子都不容易在閱讀官方解說之後馬上理解，需要透過案例演練或者採坑的經驗後慢慢掌握。

# useEffect 為何稱之為「副作用」

就像吃藥治療了身體病痛的同時也會帶來一些額外的影響，例如偏頭痛、喉嚨乾燥等等，`useEffect()` 就是提供你的應用程式一些「額外的影響」。
影響的範圍與作用透過第一個函式參數來定義，依賴更新的資料則是第二個 Dependency 參數。

# useEffect 與生命週期的關係

而副作用與**元件 component 的生命週期**息息相關，這一點在很多教學重點裡往往沒有提到，感謝 Fireship 的 YT 大佬講解得非常好懂，直接拆解出幾個核心架構：

<iframe width="560" height="315" src="https://www.youtube.com/embed/TNhaISOUy6Q?si=_aN_Q57_fOyp6vYa&t;start=230" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## class life cycle event

在 React 16.8 釋出 functional hooks 以前元件都是以 **class 形式**為基礎延伸的，而學習過 Javascript 核心的小夥伴都理解 class 語法糖其實是 function X this constructor 寫法的包裝，畢竟 Javascript 本來就沒有強硬的物件導向(OOP)寫法，完全看開發者如何應用而已。

回到 React useEffect 與生命週期的關係，class component 提供了三個基本的**元件生命週期事件**：

### componentDidMount 元件初創

在這個階段類似 Vue 的 `mounted()` 鉤子，會在元件**初創時期**啟動並執行。
useEffect 的寫法經常會搭配 Fetch API X **empty dependency array**，不用依賴任何資料的變化否則容易進入無限迴圈(Infinite Loop)，這個寫法會執行在瀏覽器首次完成渲染時。
<img class="post-image" style='margin-right: unset; margin-left: unset; padding-top: 12px' src='/blog/images/react-useEffect-1.jpg' width='min(100%, 600px)' height='auto'>

### componentDidUpdate 元件初創

在這個階段類似 Vue 的 `update()` 鉤子，會在元件**資料更新**時啟動並執行。
如果搭配 useEffect dependency array 的依賴就類似 Vue 的 `watch` 行為，根據資料變化啟動副作用。
<img class="post-image" style='margin-right: unset; margin-left: unset; padding-top: 12px' src='/blog/images/react-useEffect-2.jpg' width='min(100%, 600px)' height='auto'>

### componentWillUnmount 元件毀滅

在這個階段類似 Vue 的 `destroy()` 鉤子，會在元件**從畫面移除時**啟動並執行。
useEffect 的寫法會在 **return function** 內，標記著元件移除時要啟動的副作用，例如移除事件監聽器。
<img class="post-image" style='margin-right: unset; margin-left: unset; padding-top: 12px' src='/blog/images/react-useEffect-3.jpg' width='min(100%, 600px)' height='auto'>

## 等同 useEffect DidMount 階段的寫法

其實剛學 useEffect 鉤子不太理解加與不加的差別，因為有的行為我只想執行一次又不想加重首次渲染的負擔時就不一定會使用到，例如以下的情況：

<iframe height="300" style="width: 100%;" scrolling="no" title="React.useEffect" src="https://codepen.io/mawchu/embed/GRLaabv?default-tab=js%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/mawchu/pen/GRLaabv">
  React.useEffect</a> by Jamie Hsieh (<a href="https://codepen.io/mawchu">@mawchu</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

若資料在**不會改變**的前提下平心而論確實差不多，因為沒有重新渲染的問題；倘若資料會改變而影響 component re-render 就會開始看到差異。

使用 `useEffect` 可以將函式區域內的資料都維持在**第一次渲染後**、**資料更新前**的版本，例如以上範例，即使非同步 SetTimeout Callback 的執行其實更早(0 毫秒早於首次渲染以前)，data 仍凍結在初始值 `I'm a data.`，體現了 useEffect 在這裡的優點。

然而撰寫在 function component 內、useEffect 外且沒有使用其他 Hooks 的函式，會緊跟隨每次元件的渲染重建、渲染前執行計算、渲染後顯示結果，生命週期因渲染重新誕生、因元件毀滅而消失（除了監聽事件）。

# useEffect X empty array 是微任務

用 **宏任務(Macro task)** 或 **微任務(Micro task)** 來理解 React hooks 是狹隘的做法，畢竟怎麼為 event loop 安排還是取決於開發者的程式邏輯與使用鉤子的目的上，不過在上一個案例中 useEffect X empty array 的搭配就很接近微任務了，React 設計這些接口的初衷就是提供符合設計動機的時間點，讓開發者根據業務需求信手拈來安排想要的流程脈絡，不過理解背後的運作順序還是有助於避免採坑。

以下是 chatGpt 的解說，有時候會胡說八道需要斟酌觀看 xd

> When you use a hook like `useState`, `useEffect`, `useContext`, etc., it's not the hook itself that determines whether its execution is scheduled as a micro task or a macro task. Instead, it's the way React schedules and processes updates that determines **when the hook's associated functions are called**.
> However, some hooks, like **useEffect with an empty dependency array []**, are often used for tasks that are more closely associated with micro tasks, such as updating the DOM after rendering, it runs its effect callback after the browser **has finished painting and before the next paint**. This ensures that any DOM updates caused by the effect are applied before the browser repaints the screen. In these cases, the effect of the hook may be scheduled as a micro task, but it's not a rule that applies to all hooks.
> --chatGpt
