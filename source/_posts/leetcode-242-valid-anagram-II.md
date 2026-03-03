---
title: （二度挑戰）優化演算法練習 Leetcode X Valid Anagram - Easy
date: 2026-03-03 23:12:00
tags:
  - Algorithm
  - HashMap
  - Map
  - Javascript
  - Leetcode
  - CountArray
  - Anagram
categories:
  - Algorithm
  - Udemy learning
  - Leetcode
---

{% include_md %}
這題的解題歷程「卡了一下之後恍然大悟」的感覺非常美好，不只是答案本身，更是我如何一步步修正思路、真正理解問題內涵的過程。

<!-- more -->

# 拆解題目

## 242. Valid Anagram

Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.

> Example 1:

> Input: s = "anagram", t = "nagaram"
> Output: `true`

> Example 2:

> Input: s = "rat", t = "car"
> Output: `false`

Constraints:

1 <= `s.length`, `t.length` <= 5 \* 104
`s` and `t` consist of lowercase English letters.

# 一開始的直覺：Set

我的第一個想法是：

用 Set 來看字母是否相同

像這種：

```js
const dictionary = new Set(s);
```

這思路也不是完全錯，因為 Set 可以幫你快速知道有哪些不同字母。但仔細想一下，有一個致命問題：

Set 只會告訴你「字母有沒有出現」，卻不會告訴你「出現幾次」
但 anagram 的定義是：每個字母出現的次數也必須相同

像這種例子就會出問題：

```
aab
abb
```

這兩個字串出現的字母都是 {'a','b'}，但次數不同 — 這就是 Set 思路的卡關點。

# 如何記錄字母出現頻率？

畢竟是第二次解題，腦袋中還保存着「a ~ z」存在某種規律可循、可以使用「計分板」這兩個印象來解題，至於規律是什麼呢？

## Unicode 的連續性

<blockquote>
小寫英文字母 a 到 z 在 Unicode/ASCII 中是連續編號的
也就是 a=97、b=98、…… z=122，這個順序和英文字母一一對應。
</blockquote>

也就是：

```js
index = char.charCodeAt(0) - "a".charCodeAt(0);
```

`char.charCodeAt(0)` 代表的是第一個字母的 Unicode/ASCII 數字，`a(97) - z(122)` 正好是一連串連續加 1 的數字。

## 陣列計分板 Bill Board

這個概念可以很好的結合每個字母的「計分板」：兩個個字串計數，出現一次加一、再出現一次減一，這樣一來就能得到所有字母計數爲 0 時爲字謎（Anagram）。

基於以上規律，我把兩個字串的字母頻率全部記下來：

```js
const billBoard = new Array(26).fill(0);
```

然後：

遍歷 s，對應位置 ++
遍歷 t，對應位置 --

最後，如果所有位置都回到 0 → 代表 s 和 t 的每個字母出現次數完全一致，就是 anagram。

這段最核心的邏輯是：

```js
billBoard[char.charCodeAt(0) - 97]++;
```

這種做法在效能上是最理想的：

<blockquote>
時間複雜度：O(n)
空間複雜度：O(1)（固定 26 長度的 array）
</blockquote>

# 要注意的細節

## 字串長度不一樣要先處理

一開始我試著把兩個頻率更新合併在同一個 loop 內處理：

```js
for (let i = 0; i < s.length; i++) {
  // ...
  billBoard[t[i].charCodeAt(0) - 97]--;
}
```

但如果 t.length < s.length 的話，當 i 超過 t 的 index 時就會發生 undefined.charCodeAt(0) 的錯誤。

解法是：

```js
if (s.length !== t.length) return false;
```

或者把兩個 loop 分開寫。這樣才能避免超過邊界讀取。

## 結尾檢查

我最一開始用 Set 去判斷記分板是不是全 0；後來意識到：

<blockquote>
用 Array.every(n => n === 0) 更直覺又省事
不需要建立新的 Set 結構
</blockquote>

原因是：

every 只是跑一次迴圈檢查，不用額外記憶體(Set 是 HashMap 用空間換時間)。
結構語義也更清楚，這種小細節在效率和可讀性上都有加分。

# 最終版本的程式邏輯

下面是這個題目最乾淨、最推薦的寫法：

- 先檢查長度
- 記錄 s 字母出現次數
- 減去 t 字母出現次數
- 檢查全部為 0

# 今天的收穫：不只是跑通，而是理解

這題看起來很簡單，但其實它把很多基礎能力融合在一起：

- 字串與資料結構的轉換
- Unicode 的數值值與 index 映射
- frequency map vs set 的差異
- 錯誤邊界的思考（例如長度不一致或 undefined）

---

一開始想到 Set、再經過幾次修正、加上 unicode 映射，那整個過程不只是把 code 寫對，而是真正理解題目本質的思維成長。
在寫算法的路上，我覺得有這種「一開始卡一下但後來豁然開朗」的感覺，其實是最美好的部分 😊
