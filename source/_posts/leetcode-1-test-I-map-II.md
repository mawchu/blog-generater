---
title: （二度挑戰）優化演算法練習 Leetcode X Two Sum II
date: 2026-02-23 22:56:47
tags:
  - Algorithm
  - HashMap
  - Map
  - Javascript
  - Leetcode
categories:
  - Algorithm
  - Udemy learning
  - Leetcode
---

{% include_md %}

<!-- more -->

# 拆解題目

## Two Sum

> Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to target.
> You may assume that each input would have exactly one solution, and you may not use the same element twice.
> You can return the answer in any order.

題目說一個陣列內某兩個值相加獲得 `target`，而且只會有一種答案，需要回傳兩個數值的索引陣列 `[x, y]`。

# 自我挑戰 — 再重寫一次 Two Sum

今天剛開工想說先暖個手，打開 LeetCode 重新寫一遍 Two Sum（題目就是給一個整數陣列跟 一個 target，回傳兩個相加等於 target 的索引）。

心裡還挺有自信的，想說這題我以前寫過啊，應該是秒懂吧。
結果打開 CodePen 真的愣住了很久 😂

## 利用 HashMap 優化 O(n＾2) 為 O(n)

第一步當然是想到要用 Map 或 hash 來解 O(n) 的版本（不想再寫雙層迴圈了）。
但下一行寫到：

```js
const map = new Map();
```

然後就停住了。

我在想：「到底要把誰當成 key？ num ? index ?」
這一刻才發現自己以前可能只是會寫，但沒有真正想通為什麼是這樣。
一開始寫成 index 當作 key，結果卡在 Map.has() 用起來不順手，拿錯對象。

後來才猛然想起來：

<blockquote>
    Map.has() 是用 key 來判斷是否存在，而我要查的是：「之前有沒有出現過這個數字」
    <strong>所以 key 就必須是 num，value 才是它的 index。</strong>
</blockquote>

想清楚之後才把流程串起來：

計算當前位置的 complement =（target - num）
如果 `map.has(complement)` → 代表找到了當成 key 的另一塊拼圖，可以當成是 a + b 的 b
否則把自己 map.set(num, index) 起來，留給後面的元素配對

```js
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function (nums, target) {
  const map = new Map();
  for (const [index, num] of nums.entries()) {
    // 先查再存
    if (map.has(target - num)) return [map.get(target - num), index]; // 已存在的索引值一定較小放前面
    map.set(num, index);
  }
};
```

才終於想起怎麼寫：

- num = a
- map.has(target - num) = is b exist ?
- map.get(target - num) = b

## 輸出的順序搞混，怎麼是 是 [1, 0] ?

然後還有個小 bug —— 我第一次回傳的結果是 [currentIndex, prevIndex]，跑出來是 [1, 0]，當下還懷疑自己寫錯 😂
後來才想起來題目根本說：

<blockquote>
You can return the answer in any order.
</blockquote>

而且這個順序反過來，也只是因為我是在第二輪才找到配對，第一輪才放進 map 的索引比較小。
當前迴圈的 index 其實是下一 Round 了。

# 解題思路小記

路徑是這樣的：
我記得要用 hashMap 寫一遍之後卡在怎麽拿key
啊啊要用 has 好像不是 value
恩要先看有沒有存在 map 了再存
啊怎麽順序反了
哦原來 has 已經存在了 index 會比較小（先跑）

# 解題後感想

老實說，寫完當下有種小挫敗感：

這種簡單題我怎麼還要花時間回想…

但慢慢整理過程才發現，這次卡住的不是「語法」或「環境」，
而是把以前 背過的寫法 再一次真正 想懂。

現在站在第 2 次寫的角度，我終於理解：

為什麼 key 要放 num
為什麼要「先查再存」
為什麼這種寫法時間複雜度是 O(n)
也不會拿自己配對自己

這種理解感，比「第一次寫完覺得會」還扎實得多。

每次的迴響都如同超速學習（Ultralearning）裡提到的遺忘曲線一樣，增加記憶的黏著度。
希望有一天我能看到題目就馬上會寫 ＝Ｄ

# 第一次挑戰

回顧可以看[這篇](/blog/2024/05/09/leetcode-1-test-I-map/?highlight=two)
