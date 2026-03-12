---
title: （二度挑戰）優化演算法練習 Leetcode X Longest Substring Without Repeating Characters
date: 2026-03-08 23:40:00
tags:
  - Algorithm
  - SlidingWindow
  - HashMap
  - Set
  - Javascript
  - Leetcode
categories:
  - Algorithm
  - Udemy learning
  - Leetcode
---

{% include_md %}

這題其實是 Sliding Window 的經典題，但我大概繞了一圈才理解。

<!-- more -->

# 題目

Leetcode 3  
Longest Substring Without Repeating Characters

找出一段最長的 substring，使得裡面沒有重複字母。

# 什麼都不想的嘗試

```js
/** * @param {string} s * @return {number} */
var lengthOfLongestSubstring = function (s) {
  if (!s.length) return 0;
  if (s.length === 1) return 1;
  let left = 0;
  let right = 0;
  while (left === right) {
    right++;
    if (s[left] === s[right]) {
      left++;
      if (s[left] === s[right]) return 1;
    }
    if (s[left] !== s[right]) right++;
  }
  return right - left + 1;
};
```

## 錯誤點

```js
while(left === right)
```

這個條件會讓迴圈在探索新字母的時候，一旦 right > left 就不相等，迴圈停止。
我的解題只找了一個 substring 就結束沒找下一個，所以應該在 right 還沒到最後一個之前，都把每一個 substring 視爲一個小單位用 map 存取起來包含的字母或字串（也可能是空白），最後找 set 裏面最大的數字。

# 第一個直覺：暴力跑兩層迴圈

一開始的想法很單純：
從每個位置當起點，往右找 substring，如果出現重複字母就停止。

## 思考重點

- Set 建立在每回合 substring 查找開始的第一步。
- 若存在重複，則跳出該回合的 substring，繼續從下一個回合第一個字母開始。
- 若不存在重複，則新增字尾找到的字母，並更新最大長度。

```javascript
var lengthOfLongestSubstring = function (s) {
  let maxLength = 0;

  // 每次 start 都從 0 開始、s 最後一個字母結束
  for (let start = 0; start < s.length; start++) {
    const seen = new Set();

    // 每次 end 都從 start 開始、s 最後一個字母結束
    for (let end = start; end < s.length; end++) {
      if (seen.has(s[end])) break;
      seen.add(s[end]);
      maxLength = Math.max(maxLength, end - start + 1);
    }
  }

  return maxLength;
};
```

## 第一個撞牆

一開始其實卡了一下：

<blockquote>
Set 要放在哪裡？
</blockquote>

後來才發現：

每個 start 都是新的 substring，所以 Set 必須在外層迴圈裡重新建立。
清除上一回合的字母記錄。

## 第二個撞牆

一開始也會不小心寫成：

```js
seen.has(s[start]);
```

但內層迴圈其實是在問：新的字母能不能加入 substring，所以要着重在 end。

所以應該檢查：

```js
seen.has(s[end]);
```

## 演算法的優化空間

這個暴力解其實有很多重複計算。

```js
abc;
abca;
abcab;
abcabc;
```

不需要每次都從 start = 0 開始，當往 end 探索時發現重複的字母時，start 應該從重複的字母的上一個位置開始、往後挪一個。

這時候才開始理解 sliding window 的想法：

<blockquote>
不要重新開始，而是移動左邊界
</blockquote>

# 暴力解優化版

用左右指針維持一個合法區間，並用 `includes` 檢查是否重複，重複舊往左推進左指針，直到位置走到不再重複的字母爲止。但

```js
var lengthOfLongestSubstring = function (s) {
  let left = 0;
  let max = 0;

  for (let right = 0; right < s.length; right++) {
    while (s.slice(left, right).includes(s[right])) {
      left++;
    }

    max = Math.max(max, right - left + 1);
  }

  return max;
};
```

# Sliding Window 解法重點

又稱爲「滑動視窗」的演算法，在合法條件下維持在窗戶範圍內。
下面是解題重點，右指針負責探索新字元、左指針負責修正窗戶長度。

```js
while (right < s.length)
```

# Sliding Window + Set

```js
var lengthOfLongestSubstring = function (s) {
  let left = 0;
  let seen = new Set();
  let maxLength = 0;

  for (let right = 0; right < s.length; right++) {
    while (seen.has(s[right])) {
      // kick out last round substring edge character
      seen.delete(s[left]);
      // move to next
      left++;
    }

    seen.add(s[right]);
    maxLength = Math.max(maxLength, right - left + 1);
  }

  return maxLength;
};
```

## 思考重點

- right 負責探索新的字母。
- 若新字母已存在於 window 中，則需要修復 window。
- 修復方式是從左邊逐步刪除字母 (set.delete(s[left]))。
- 每次移動 left，window 都會縮小。
- 直到新字母不再重複，才能加入 window。

## 第一個撞牆

`while (seen.has(s[right]))` 寫成 `while (seen.has(s[left]))` 沒有理解到 right 指針的對象才是放進字典的對象。

# 一個很短的心法

不是列舉所有 substring，而是維護一個「當前合法的 substring」
這句話就是這題最核心的地方。

# Sliding Window + Map

這種解題的快速心法就是直接移動左邊視窗到右邊當前字元上一次出現（不含當前 right 位置）的後一個位置，省略許多一步步移動的過程。

```js
var lengthOfLongestSubstring = function (s) {
  let maxLength = 0;
  let left = 0;
  const seenMap = new Map();

  for (let right = 0; right < s.lenght; right++) {
    if (seenMap.has(s[right])) {
      // 跳過去上一次重複字元隔壁，且避免倒退
      left = Math.max(left, seenMap.get(s[right]) + 1);
    }
    seenMap.set(s[right], right);
    maxLength = Math.max(maxLength, right - left + 1);
  }
  return maxLength;
};
```

這一段 `left = Math.max(left, seenMap.get(s[right]) + 1);`
是因為 right 站在當前的字母，而上一個相同字母可能在 left 的更左邊導致 left 後退，但這是不符合 Sliding Window 演算法「滑動視窗」的特性，所以必須與他自身的當下位置比較，以免後退。
