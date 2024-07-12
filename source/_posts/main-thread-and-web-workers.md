---
title: Web Workers - Main thread's helper 主執行緒的好幫手
date: 2024-07-12 17:58:57
tags:
- client
- browser
categories: Web worker
---

{% include_md %}

前端新時代根據 **異步執行(Asynchronous)** 原理產生新的技術與套件，例如 Promise 與 Async Await 使得 **宏任務(Macro Task)** 與 **微任務(Micro Task)** 在 **事件迴圈(Event Loop)** 的完美委派下讓人忘記 Javascript 其實是 **單線程(Single Thread)** 的程式語言，而昂貴或者繁雜的計算成本很可能會阻塞(Block)主執行緒的前進，這時候分擔任務的好幫手 Web workers 就是出場的好時機了。

# Parallel Executive Concept 平行的工作節奏
主執行緒與 Web worker 的工作模式是併發的(Concurrency)，同時並且消耗額外的 CPU 空間來運算而不會導致當下的工作會互享影響，能更有效率的分工合作完成任務外還營造給使用者絲滑的使用體驗(User Experience)，使用之前先對應用場景有基本的概念：