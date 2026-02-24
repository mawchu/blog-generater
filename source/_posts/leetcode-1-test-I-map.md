---
title: 優化演算法練習 Leetcode X Two Sum - Easy
date: 2024-05-09 16:33:50
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

從小數理就不好的我對於刷題存在滿滿的恐懼，但漸漸在學習編程語言中理解邏輯是可以透過訓練來提高靈敏度。

<!-- more -->

幾次面試都直接傳一題 Leetcode 定生死讓我不得不重視自己的邏輯思考與演算概念，決定來直面自己的害怕從 Easy 開始練習。

# 拆解題目

## Two Sum

> Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to target.
> You may assume that each input would have exactly one solution, and you may not use the same element twice.
> You can return the answer in any order.

題目說一個陣列內某兩個值相加獲得 `target`，而且只會有一種答案，需要回傳兩個數值的索引陣列 `[x, y]`。

## Big O 角度思考

演算法的 **時間複雜度(Time complexity)** 與 **空間複雜度(Space complexity)** 是優劣的兩個核心標準，我給自己的簡單記法就是「少跑迴圈(Loop)！多用指向(Notation)或映射！」，若最低限度仍非用迴圈不可就降低次數，因為迴圈對 Big O 傷害是很大的要盡量避免。

## 查看題示

> - A really brute force way would be to search for all possible pairs of numbers but that would be too slow. Again, it's best to try out brute force solutions for just for completeness. It is from these brute force solutions that you can come up with optimizations.

> - So, if we fix one of the numbers, say `x`, we have to scan the entire array to find the next number `y` which is `value - x` where value is the input parameter. Can we change our array somehow so that this search becomes faster?

第一個提示為暴力解沒啥參考價值可忽略，第二個給予的方法唯一大方向：`value - x = y`，透過尋找陣列裡的兩個點 `[x, y]` 而不是一個一個找。

> - The second train of thought is, without changing the array, can we use additional space somehow? Like maybe a hash map to speed up the search?

第三個題示點出使用 `hash map`，運用指向(Notation)來尋找目標會勝過遞迴的效率，如果知道 `value - x = y` 就能找出答案。

# 解答A

因為領悟力不太好又剛開始刷題，看了很久想出來的第一個版本：

{% codeblock lang:javascript %}
/\*\*

- @param {number[]} nums
- @param {number} target
- @return {number[]}
  \*/
  var twoSum = function(nums, target) {
  for(var i=0; i<nums.length; i++) {
  for(var j=0; j<nums.length; j++) {
  if(i === j) break;
  if(i !== j) {
  if (nums[i] + nums[j] === target) return [i, j]
  }
  }
  }
  };
  {% endcodeblock %}

一開始還忘了跳出迴圈要使用 break，加上去後 runtime 就往前排好幾格了。
但這個版本有很致命的雙層迴圈，需要想方法優化演算法。

# 關於 HashMap 資料結構

HashMap 又稱為「關聯數組」，將一組資料透過至少一種獨特的標記方式來辨認與分化，讓 **查詢** 透過鍵值對的映射找到目標，Javascript `Map` 的一個特性和一般物件有所不同：

參考來源 [MDN](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Map)

## 任何值都可以作為鍵或值

Object 僅接受字串型別和 Symbol 作為鍵，而 Map 可以接受任何值。

> Map 是保存了鍵值對（key-value pairs）的物件。**任何值（包括物件及基本型別（primitive）值）**都可以作為鍵或值。

## 順序嚴格

Object 的 key 值順序不一取決於瀏覽器引擎的習慣，但 Map 迭代鍵的順序嚴格遵循新增的順序。

> 一個 Map 物件會根據元素的 **新增順序** 走訪自身的所有元素，

## 執行效率

> 在涉及頻繁添加和刪除鍵值對的場景中，Map 可能表現得更好。

## 可迭代(literable)

> Map 是可迭代（iterable）的，因此可以直接迭代，而在 Object 上迭代則需要以某種方式獲取其鍵並對其進行迭代。

# Map 幾個好用方法

既然 Map 稱為地圖當然是找東西方便，提供的幾個原生方法可以大大解救你的查找效率：

## Map.prototype.set(key, value)

設定 key-value pairs，並且固定順序。

## Map.prototype.get(key)

取得 key 值的 value。

<iframe height="300" style="width: 100%;" scrolling="no" title="Map vs Object" src="https://codepen.io/mawchu/embed/bGyGvWq?default-tab=js%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/mawchu/pen/bGyGvWq">
  Map vs Object</a> by Jamie Hsieh (<a href="https://codepen.io/mawchu">@mawchu</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

# 解答B

經過上面概念的拆解與資料結構應用，可以更好的掌握 Map 映射的優勢與運算效能：

{% codeblock lang:javascript %}
var twoSum = function(nums, target) {
let numMap = new Map();
console.log('numMap', numMap)
for(let i=0;;i++) {
if(numMap.has(target - nums[i])) {
return [i, numMap.get(target - nums[i])]
} else {
numMap.set(nums[i], i);
}
}
};
{% endcodeblock %}
簡單的想法拆解：

- 繞不過一層迴圈，但找到答案就回傳並結束減少次數
- 運用 `target-nums[i]` 直接找到第二個值，並取得該值的 index
- 找不到的存取 index 直到被找到
