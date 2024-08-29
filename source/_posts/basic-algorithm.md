---
title: Basic algorithm 極淺談演算法
date: 2024-05-10 17:51:39
categories: Algorithm
tags:
- algorithm
- Big O
- Time complexibility
- Space complexibility
---

{% include_md %}

演算法聽起來很有距離感，文組人會閃很遠的那種東西，但就跟文言文一樣只是簡單用幾個字說完一個敘述而已：
Udemy 資料結構與演算法 (JavaScript) [學習紀錄](https://www.udemy.com/course/algorithm-data-structure/)
<!-- more -->

## 定義
- 演算法是一個依據被定義好的(Well-defined)、次序有限的(finite)電腦可操作指令，用來解決問題或者完成演算。
- 簡單來說就是解決某個問題的程序(Step-by-step)與手法(procedure)。

## 生活範例
- Google Map 找出當前標的到目的地的「最短路徑」。
- Youtube 如何在百花齊放的影片中推薦你適合的列表。
- Excel 的財務報表如何將數據排列與分析。
- Facebook & Instagram 如何推薦你的好友或者你可能認識的人...

## 比較/優化演算法的目的
隨著演算的複雜度與資料的龐大增加，在執行時間與佔用空間上好的演算法與壞的演算法可以差距非常多倍，影響到整個軟體的使用體驗與計算效率，尤其是後端最容易遭遇各種內部業務邏輯的設計與外部同時間的分散式流量需求等因素，加重了糟糕的演算效能。
評估一個演算法好壞的單位為 Big O。

### 時間複雜度(Time complexity)
Leetcode 的 `runtime` 指標，例如以下的等差和計算範例，兩個不一樣的演算法獲得同一個結果，但在運作時間上隨著數據的龐大越差越遠。但每次的 `runtime` 時間不一也不穩定，需要根據硬體的條件與設備反映不同結果。

<iframe height="300" style="width: 100%;" scrolling="no" title="Algorithm basics" src="https://codepen.io/mawchu/embed/PovoaYx?default-tab=js%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/mawchu/pen/PovoaYx">
  Algorithm basics</a> by Jamie Hsieh (<a href="https://codepen.io/mawchu">@mawchu</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

#### Complexity 的評估
複雜度(Complexity)的評估可以按照幾個大方向增加：
- 運算子(Operator)數量。
- 參數的複雜度、數量(Input size)象徵可能的、最糟糕的運算條件。
- 函式 `f(n)` 用來表示複雜性(Complexity)與參數的複雜度(Input size)之間的關係。

### 空間複雜度(Space complexity)
Leetcode 的 `memory` 指標，係指演算執行的過程占用電腦記憶體的空間大小。例如建立一個變數(variable)承接資料的值需要占用記憶體空間，若直接 return 結果則可以節省空間為最簡單的例子，不過有時候為了易維護性的取捨可能會斟酌使用。