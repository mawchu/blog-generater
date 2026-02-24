---
title: （二度挑戰）優化演算法練習 Leetcode X Contains Duplicate - Easy
date: 2026-02-24 22:41:01
tags:
  - Algorithm
  - Hashtable
  - Map
  - Set
  - Javascript
  - Leetcode
categories:
  - Algorithm
  - Leetcode
---

{% include_md %}
距離上次解這題又過去一年了，而這次解題出乎意料的快只花了十五分鐘，給自己拍拍手！

<!-- more -->

# 題目說明

217. Contains Duplicate (Easy)
     Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.

## 範例

Example 1:
Input: nums = [1,2,3,1]
Output: true
Explanation:
The element 1 occurs at the indices 0 and 3.

Example 2:
Input: nums = [1,2,3,4]
Output: false
Explanation:
All elements are distinct.

Example 3:
Input: nums = [1,1,1,3,3,4,3,2,4,2]
Output: true

# 自我挑戰 — 再重寫一次 Contains Duplicate

由於是第二次寫 LeetCode 題目，昨天解完 Two Sum 的熱度還在。
所以當我看到題目出現「找出重複」這種字眼時，腦袋幾乎是反射性地把它跟「是否存在過」連想在一起。

那種感覺很微妙。

不是在想「這題怎麼解」，而是直接跳到：

這是不是 O(n) 模式？ A - B 指針查找的解法？

我盯著題目的陣列想了一下，如果這次還用 Map 老招數，好像有點多餘。
因為 Map 是 key → value 的對照關係，但這題只在乎一件事：「有沒有出現過數字？」

不需要第二個條件，不需要索引對應、只需要存在性。

於是我想到 Map 的兄弟 —— Set。

## 為什麼說 Set 是 Map 的兄弟？

想到 Set 之後，我其實還多想了一步：為什麼它會被叫做 Map 的兄弟？

<blockquote>
因為在很多語言的實作裡，Set 底層其實就是用 HashMap 做的。
</blockquote>

概念上可以想成這樣：

```js
const map = new Map();
map.set(value, true);
```

Set 只是把 value 當作 key 存進去，value 本身沒有對應資料，只是佔位。

換句話說：

- Map = key → value
- Set = key（value 就是 key 自己）

這也是為什麼我在想這題時會覺得：如果用 Map，好像多帶了一個 value 出來。
因為這題只需要知道「你出現過沒有」。

這一瞬間其實滿清楚的——

Two Sum 需要對應關係，所以用 Map。
Contains Duplicate 只需要存在性，所以用 Set。

不是技巧差異，是需求差異。

## 這種選擇其實代表理解層級

我後來才發現這題真正的差別不在語法，而在於我有沒有意識到「題目只需要存在性」。

當我看到 duplicate，腦袋浮現的不是資料結構名稱，
而是這題只在乎「有沒有出現過」。

然後才自然選擇 Set。

# 直接上解法

```js
var containsDuplicate = function (nums) {
  const seen = new Set();

  for (const num of nums) {
    if (seen.has(num)) return true;
    seen.add(num);
  }

  return false;
};
```

整體邏輯其實非常直覺：

走到一個數就問：我之前看過你 (Seen) 嗎？

- 如果看過 → 結束
- 沒看過 → 記起來

全部跑完還沒發現，就代表沒有重複。

這次的感覺不太一樣，這題其實不難，但我覺得有趣的是，我沒有回去想雙迴圈。
以前的我可能會這樣：「那就每個數字跟後面全部比一次吧。」

但這次沒有，因為 Two Sum 的模式還在腦袋裡。
Two Sum 是：我之前有沒有看過一個可以配對的數？

Contains Duplicate 是：我之前有沒有看過同一個數？本質完全一樣。

這種「思維延續」的感覺，比單純寫對題目更有成就感呢。

# 小小地雷：return 放哪裡

我其實也踩了一個小錯誤，一開始把 return 放錯位置：

```js
for (const num of nums) {
  if (seen.has(num)) return true;
  seen.add(num);
  return false; // 錯了
}
```

然後才發現怪怪的，return false 放在 for 裡面，等於第一圈就直接離開迴圈。
這題再次提醒我一件事：

<blockquote>
return 代表的是「離開整個 loop」。
</blockquote>

# 這題真正讓我意識到的事

我突然發現，我開始會看關鍵字。

- duplicate
- visited
- already seen

這些字一出現，我腦袋會自動浮出 Set。
這代表我開始在辨認模式，而不是背答案。

# 解題後感想

Contains Duplicate 本身不難，但它是一個很好檢查自己是否真正理解 Hash 結構思維的題目。
當我看到題目就能自然想到：「這題是不是查閱是否已存在？」

這種感覺，比解出一題還更值得記錄 =D。

# 第一次挑戰

回顧可以看[這篇](/blog/2025/03/20/leetcode-217-test-contains-duplicate/)
