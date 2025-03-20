---
title: leecode-test-contains-duplicate
date: 2025-03-20 11:53:20
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
又來到歡樂的(自虐的) Leetcode 時間，本篇深入探討考題 217 `Contains Duplicate` ：
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

# 解題思維

## 善用 Set 去除重複
1. 每每看到 `Duplicate` 關鍵字很直覺反應想到 hash 方法 `Set()`，可以很快速地挑檢出獨一無二的數字並取得其長度，一但取得的長度大於傳入的 nums 就可以確定其中存在重複性數字了！
    ```js
    var containsDuplicate = (nums) => new Set(nums).size > nums.length;
    var containsDuplicate = (nums) => [...new Set(nums)].length > nums.length;
    ```
    以上兩種方法都可以確定數字陣列 nums 中存在重複數字，其中小小差異在於 `.size` 可以直接取得 Set 集資料表有多少數字，而轉化成陣列後須改以 `.length` 取得，方法一簡潔而方法二易懂。

2. 建立 Map 映射直接返回找到的、排除不存在的數字：
    ```js
    var containsDuplicate = (nums) => {
        const numSet = new Set();
        for (num of nums) {
            if (numMap.has(num)) return true;
            else numMap.add(num);
        }
    }
    ```
    先於映射表中確認數字符合重複條件就跳出、沒有就 `add` 在映射表中，效率上比方法一更好的地方在於不需將所有數字都操作一遍 `add` (new Set(nums))可以找到重複數字，除非第一個重複數字在最後一個位置。

# 題後惡補
來記錄幾個 leetcode 解題的秘訣：

## Hash 哈希(雜湊) 
哈希表基於哈希函數將鍵映射到一個固定大小的數組索引中，從而實現了快速的查找、插入和刪除操作。這些操作的平均時間複雜度通常是 O(1)，這使得 Map 和 Set 成為處理大量資料時非常高效的資料結構。

### Map
Map 是一個鍵值對（key-value）資料結構，它通常基於哈希表來實現。每個鍵值對的鍵（key）會經過哈希函數轉換成一個哈希碼，然後根據該哈希碼將數據儲存在哈希表中。

### Set
Set 是一個*不允許重複元素*的集合資料結構。在 Set 中，每個元素都作為一個「鍵」，而哈希表中則存儲這些鍵（不需要對應的值）。Set 可以利用哈希表的特性來快速檢查元素是否存在，以及高效地執行插入和刪除操作。

## Set 和 Map v.s. Hashtable 的運算優勢
### 哈希碰撞處理
Set 和 Map 使用更加現代和有效的哈希碰撞處理機制，這意味著它們能夠更好地管理可能的哈希碰撞情況。傳統的 Hashtable 可能在碰撞發生時造成性能下降，特別是當哈希函數的設計不夠良好時。
在現代的 JavaScript 實現中，Set 和 Map 通常會使用更優化的哈希函數來確保鍵分佈均勻，這有助於減少碰撞並提高性能。

### 安全性機制
Map 和 Set 允許鍵是 任意類型，包括對象、函數，甚至是 NaN、undefined 等。這意味著你可以將任何資料類型作為鍵來存儲數據，而不像傳統的 Hashtable，在某些語言中只能使用字串或數字作為鍵。

### 按元素插入的順序來迭代元素
Set 和 Map 提供了 穩定的插入順序，即它們會按元素插入的順序來迭代元素。這和傳統的 Hashtable 不同，因為 Hashtable 中的鍵的順序是無序的。

### 防止鍵的重複
在某些語言的 Hashtable 實現中，若鍵的命名不當（例如，與內建屬性名稱相同），可能會導致鍵被意外覆蓋或隱藏。
Set 和 Map 避免了這些問題，因為它們有明確的鍵範圍和更高的安全性保障。它們的鍵不會被隨意覆蓋，而且能夠避免由於錯誤的鍵類型而引起的潛在錯誤。

## 解題後感想
有發現 leetcode 幾個題目都在圍繞 `Set` `Map` 方法與概念的熟練度與靈活運用，映射的做法大大提高了運算效能值得多練練。