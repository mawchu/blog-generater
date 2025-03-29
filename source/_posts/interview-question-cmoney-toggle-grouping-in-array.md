---
title: 面試問題集回顧 - Interview QA X CMoney
date: 2025-03-29 21:12:22
tags:
- Interview
- Algorithm
- CMoney
- Medium
categories:
- Interview
- Algorithm
---

{% include_md %}
在翻找 codepen 歷史資料的時候重新回顧了一年多前曾經在 CMoney 理財公司面試遇到的題目，當時太緊張能力也不足所以沒能解出來，趁最近在刷題的手感來重新挑戰一下吧！
<!-- more -->

# 題目說明

由於紀錄的當下很匆忙沒有完整的問題敘述，只記得片段：

``` js
// input
var arr = [true, true, false, true, false, false, false, true, false, true, true, false];
// 預期的輸出結果
[true, true, true, false, false, false, true, true, true, false, false, false];
// 預期的輸出索引
[0, 1, 3, 2, 4, 5, 7, 9, 10, 6, 8, 11];
// 可以確認 newArr 的長度 ％ 3 以及陣列最後一個是蛇麼值來判定下一個塞什麼
  ```

請 AI 幫助分析原始題目可能是？

## 推測題目

給定一個布林值陣列 `arr`，要求將 `arr` 的布林值以 **每 3 個為一組** 按順序排列， `true` 和 `false` 切換。

# 問題解析
最後一句是當初解題的時候留下的靈感，「可以確認 newArr 的長度 ％ 3 == 0 以及陣列最後一個是什麼值來判定下一個塞什麼」。

從題目看 `[0, 1, 3]` 是 `true`、`[2, 4, 5]` 是 `false` 並以此類推可以觀察出：
排列並且記住原始索引位置，3 個一組就改變布林值。

## 切換邏輯
想了兩個小時加上沒吃早餐剛好要出門剪頭髮就先停下，最後在筆記本記錄一個靈感：
「(索引值 / 3) % 2 == 0 偶數次為 `true` 反之 `false`」

```js
 [ 0, 1, 2, | 3, 4, 5, | 6, 7, 8 ]
//除 3 取整 0; 除3 取整 1;  除3 取整 2
```
就決定用此邏輯推算切換布林值的判斷式。

``` js
  let curr = (parseInt(newArr.length / 3)) % 2 == 0; 
  ```

## 小孩子才做選擇，我全都要
早上卡兩小時都是忽略一個致命的細節，不符條件的會被迴圈漏掉，最後發現整個 `newArr` 都是 `true`。
``` js
  arr.forEach((bool, index) => {
    // -- 只會跑一圈 true
  })
  ```
那要怎麼留下來並且一次次重新回頭找漏掉的呢？
咦？等等，我全都拿不就好了嗎？把當下符合的剔除後從頭再找？

### 符合條件去掉、不符條件下一輪用並從頭找
最後我決定使用 `splice` 幫我在移除自己的同時保留漏掉的。

#### 版本一
```js
var arr = [true, true, false, true, false, false, false, true, false, true, true, false];
let newArr = [];
// let target = [true, false, true];
let map = arr.map((bool, index) => ( // for memorizing index
  {
    bool, idx: index
  }
));

let newMap = Object.assign(map);
// 拿完就刪掉
while(newMap.length) {
  let curr = (parseInt(newArr.length / 3)) % 2 == 0; 
  arr.forEach((bool, index) => {
    if(newMap[index].bool == curr) {
      newArr.push(newMap[index]);
      newMap.splice(index, 1);
    } 
  }
}
let nArr = newArr.map(({bool, idx}) => bool)
let nIdx = newArr.map(({bool, idx}) => idx)
```

上面的做法有幾個問題：

1. Object.assign 的淺拷貝會導致 `map` 被 `newMap` 修改到參考。
2. `newMap[index]` 的索引值是 `arr` 的，會在過程記錄到 `arr` 而非 `newMap` 自己移除了錯誤的索引。
3. 迴圈的條件不應該是規律的 `arr.forEach` 而應該是根據 `newArr` 的長度是否已達標。

#### 版本二
```js
let newMap = [...map];
let counter = 0;

while(newMap.length) {
  let curr = !(parseInt(newArr.length / 3)) % 2 == 0; 
  if(newMap[0].bool == curr) {
    newArr.push(newMap[0]);
    newMap.splice(0, 1);
  } 
}
let nArr = newArr.map(({bool, idx}) => bool)
let nIdx = newArr.map(({bool, idx}) => idx)
```
仍有幾個問題：

1. 永遠都從 0 開始，如果條件不符的沒有繼續往下一個訪查。
2. `newMap[index]` 的索引值是 `arr` 的，會在移除過程記錄到 `arr` 而非 `newMap` 自己。

#### 版本三
```js
let map = arr.map((bool, index) => (
  {
    bool, idx: index
  }
));

let newMap = [...map];
let mapLength = map.length;
let counter = 0;
// 拿完就刪掉
while(newMap.length && counter < arr.length) {
  let curr = (parseInt(newArr.length / 3)) % 2 == 0; 
  console.log('curr', curr)
  if(newMap[counter].bool !== curr) counter++;
  if(newMap[counter].bool == curr) {
    counter = 0;
    newArr.push(newMap[counter]);
    newMap.splice(counter, 1);
  } 
}
```
仍有個問題：

1. `counter` 太早歸 0，當本次符合條件的對象（第一次或其他次不符條件的對象佔據前方）不在第一個時，會導致永遠推進與移除第一個。
2. `counter < arr.length` 會觸發 `Uncaught TypeError: Cannot read properties of undefined (reading 'bool')` 的錯誤是因為當 `counter++` 大於 `newArr.length-1` 的時候會等於 `undefined`。

很接近了！！繼續努力 🫣 👊

#### 版本四
```js
let map = arr.map((bool, index) => (
  {
    bool, idx: index
  }
));

let newMap = [...map];
let mapLength = map.length;
let counter = 0;
// 拿完就刪掉
while(newMap.length && counter < newMap.length) {
  let curr = (parseInt(newArr.length / 3)) % 2 == 0; 
  console.log('curr', curr)
  if(newMap[counter].bool !== curr) counter++;
  if(newMap[counter].bool == curr) {
    newArr.push(newMap[counter]);
    newMap.splice(counter, 1);
    counter = 0; // 避免太早重置了本次符合條件的位置
  } 
}
console.log('newArr', newArr.map(({bool, idx}) => bool))
console.log('newIdx', newArr.map(({bool, idx}) => idx))
```

完美印出答案：

```js
// [true, true, true, false, false, false, true, true, true, false, false, false];
// [0, 1, 3, 2, 4, 5, 7, 9, 10, 6, 8, 11];
```

# 問題難度

解題過程能感受到邏輯拆分與重組的難度，好奇問了下題目的分級屬於？
> 從目前的推測來看，這個問題的難度應該屬於 Medium。

## 原因分析

### 不單純是遍歷排序 (Easy)

如果只是簡單將 `true` 和 `false` 分開排序，那會是 Easy 題型。
但這裡似乎涉及依順序、按規則分批重組，需要額外邏輯。

### 需要管理多個列表 (Medium)

將 `true` 和 `false` 分開儲存，再依指定順序拼接，且可能涉及 **分批處理 (batching)**，這種設計通常在 **Medium 難度** 題目中常見。
涉及條件中斷或順序判斷，題目可能還需要根據當前組合的最後一個元素來判斷下一批應該塞 `true` 還是 `false`，這種依賴狀態的邏輯讓它比 Easy 更複雜。

### LeetCode 難度對應：

Easy：遍歷或單一條件分類即可完成。
Medium：需要狀態管理、分批處理、順序或條件依賴。
Hard：通常涉及動態規劃、圖論或複雜數據結構。



# 題後優化
題目裡面頻繁操作 `newMap` 與 `splice` 的做法明顯讓我感覺效能應該不好，所以試探地問了下 ChatGpt：

> splice 是 O(n) 複雜度：
> 每次刪除元素，後面的元素要往前移動，所以在大數據集會變慢。
> counter 重置 = 重複遍歷：
> 每次從 counter = 0 重新掃描，導致無效遍歷次數增加。

> 時間複雜度	最差情況 O(n²) (每次 splice + 重置)。

接下來延伸探討效能與邏輯更易維護的做法。