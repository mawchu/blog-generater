---
title: Vue3 - useful features 實用工具解析
date: 2024-08-14 14:34:02
tags:
---

{% include_md %}
<!-- more -->

又來到填坑的好時機了，這篇來重點介紹一下 Vue3 釋出的幾個好用的小工具來加快業務邏輯開發的效率

# WatchEffect
該函式範圍內的依賴（Dependency）都會被直接偵測到並且觸發副作用，不需要特地撰寫 `immediate: true` 、 `deep: true` 與指定依賴（Source），大大的助益了多個依賴時的維護度。
>`watchEffect` only tracks dependencies during its synchronous execution. When using it with an async callback, only properties accessed **before the first await tick** will be tracked.
同步執行的程式才會追蹤依賴（Dependency）變化，若以非同步形式 `async` 撰寫 Callback 則第一個 `await` 之前被監聽的依賴（Source）才會被追蹤。

<iframe height="300" style="width: 100%;" scrolling="no" title="Vue3 - watchEffect &amp; async function" src="https://codepen.io/mawchu/embed/XWLVJdY?default-tab=js%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/mawchu/pen/XWLVJdY">
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
