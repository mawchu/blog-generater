---
title: Web Workers - Main thread's helper 主執行緒的好幫手
date: 2024-07-12 17:58:57
tags:
- client
- browser
categories: Web worker
---

{% include_md %}
<!-- more -->

前端新時代根據 **異步執行(Asynchronous)** 原理產生新的技術與套件，例如 Promise 與 Async Await 使得 **宏任務(Macro Task)** 與 **微任務(Micro Task)** 在 **事件迴圈(Event Loop)** 的完美委派下讓人忘記 Javascript 其實是 **單線程(Single Thread)** 的程式語言，而昂貴或者繁雜的計算成本很可能會阻塞(Block)主執行緒的前進，這時候分擔任務的好幫手 Web workers 就是出場的好時機了。


# Parallel Executive Concept 平行的工作節奏
主執行緒與 Web worker 的工作模式是併發的(Concurrency)，同時並且消耗_額外的 CPU 空間來運算_而不會導致當下的工作會互享影響，能更有效率的分工合作完成任務外還營造給使用者絲滑的使用體驗(User Experience)，使用之前先有基本的概念：

## Accessing the DOM
主執行緒(Main Thread)與工作夥伴(Workers，自己翻得比較親切)最大差異在於前者可以取得 DOM 的應用權，而後者不行；所以主執行緒才是操作使用介面(UI)的主人。
> Web Workers are all about keeping a seperate thread on the browser different than the main thread which runs all the rendering efforts of the UI.
[Web Workers in a Nutshell](https://hwclass.medium.com/web-workers-in-a-nutshell-809f1dbe7fbf)

## Web Workers work on background
Web Workers 的運算是在背景執行的，有自己的 CPU 運算空間。

## Seperate scope
基於每個執行緒(Thread)都是獨立的作用域，主執行緒(Main Thread)與工作夥伴(Workers)之間不共享資料須要透過 Message Event 互相傳遞與溝通，`postMessage` 發送、`onMessage` 監聽。

## Main Thread creates Web Workers
工作夥伴(Workers)是基於主執行緒的執行環境產生的次執行緒，生命週期由主執行緒決定產生(Creating)與毀滅(Closing)，但彼此的工作執行是併發的不會互相影響，避免 Blocking the Thread。

{% img /images/main-thread-and-web-workers-0.jpg "Resource: https://hwclass.medium.com/web-workers-in-a-nutshell-809f1dbe7fbf" %}
{% img /images/main-thread-and-web-workers-1.jpg "Resource: https://viblo.asia/p/simple-web-workers-workflow-with-webpack-3P0lPkobZox" %}

# Demo example
範例使用龐大的 For loop 來佔用執行緒的計算空間，體驗不同執行序工作下卡頓的情況：
<iframe height="300" style="width: 100%;" scrolling="no" title="js - Web Workers" src="https://codepen.io/mawchu/embed/yLdLZmQ?default-tab=js%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/mawchu/pen/yLdLZmQ">
  js - Web Workers</a> by Jamie Hsieh (<a href="https://codepen.io/mawchu">@mawchu</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>