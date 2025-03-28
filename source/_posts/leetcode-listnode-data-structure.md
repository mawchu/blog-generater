---
title: 優化演算法練習 Leetcode X ListNode 資料結構
date: 2025-03-23 16:35:19
tags:
---

{% include_md %}
**Linked List** (ListNode) 是最常與 **Array** 結構做比較的一種資料型態，對於非資工背景的小夥伴來說比較陌生，我們可以用幾個情境快速理解：

<!-- more -->

# ListNode v.s Array

**ListNode 鏈結串列 (Linked List)** 並不存在 JavaScript 原生的型別與其語言特性有很大關係：

- JavaScript 的內建資料結構通常以物件 ({})、陣列 ([])、Map、Set 為主
- 鏈結串列 (Linked List) 主要在低階語言 (如 C、C++) 中使用較多，ListNode 適合的情境在於極大化利用電腦內存，因為這些語言可以直接操作記憶體指標。

|     特性      |    陣列 (Array)    |   鏈結串列 (Linked List)   |
| :-----------: | :----------------: | :------------------------: |
|   訪問速度    |   O(1)(隨機訪問)   |      O(n)(需從頭遍歷)      |
| 插入/刪除速度 |  O(n)(需搬移數據)  |     O(1)(改變指針即可)     |
|   內存使用    |  需要連續內存空間  | 分散內存，靈活但內存開銷大 |
|   適用場景    |  需要快速隨機訪問  | 頻繁的插入、刪除、動態長度 |
|   日常例子    | 商品系統、分數記錄 |      地鐵站、排隊系統      |

## 既生瑜，何生亮

在 JavaScript 實務開發中，鏈結串列並不常用，因為：

- JavaScript 的陣列已經是動態分配的，比鏈結串列更容易使用。
- 陣列的 `push`、`pop`、`shift`、`unshift` 等操作非常方便。
- 鏈結串列的遍歷 **O(n)** 可能比陣列索引 **O(1)** 更慢。

不過，在演算法練習或需要高效刪除**中間節點**的場景，鏈結串列還是有其價值。

> Array 在操作資料頭尾以及**已知索引訪問**有效率，操作新增或刪除中間需要移動位置 `n ~ last`。
> Linked List 在操作新增或刪除中間有效率，可以直接改變 `指標 (Pointers)`，操作頭尾需要依序查找(next)。

## 深入理解記憶體與指標概念

雖然 JS 是高階語言，不需要手動管理記憶體，但學習鏈結串列可以讓你理解：

- 指標 (Pointers) 的概念
- 記憶體分配
- 為什麼某些資料結構（如陣列、物件）比鏈結串列更適合 JavaScript

> 鏈結串列雖然不常見於前端，但在 **記憶體受限的環境、處理大數據流** 時，可能比陣列更有效率。

## Linked List 是什麼

來看一下如何創建一個 `ListNode`：

```js
function ListNode(val, next) {
    this.val = (val === undefined ? 0 : val); // Value of the node
    this.next = (next === undefined ? null : next); // Reference to the next node
}
// 以上等同於：
class ListNode {
    constructor {
        this.val = (val === undefined ? 0 : val); // Value of the node
        this.next = (next === undefined ? null : next); // Reference to the next node
    }
}

// 建立測試鏈結串列 1 -> 3 -> 5
let list1 = new ListNode(1, new ListNode(3, new ListNode(5)));
// 建立測試鏈結串列 2 -> 4 -> 6
let list2 = new ListNode(2, new ListNode(4, new ListNode(6)));

```

### 理解重點

底層其實就是一個建構子函式建立的物件並具有兩個屬性：

- val：該節點 (node) 儲存的資料。
- next：鏈結指向的下一個節點 (node)。
- reference：指向的節點(Node)其實就是一種參考。

### 指向的方式

```js
ListB.next = ListA; // 這裡 current.next 應該指向一個 ListNode，確保賦值的是新的節點物件
```

### 節點不是被刪除，而是不再被指向

查看以下的節點訪問改變範例：

```js
let BList = new ListNode(1, new ListNode(2, new ListNode(3))); // 1 -> 2 -> 3 -> null
BList = BList.next; // 2 -> 3 -> null
//
```

現在，BList 指向 `2 -> 3 -> null`，而原來的 `1 -> 2 -> 3 -> null` 就沒有變數或引用再指向它。因此，`1` 節點就會變成孤立節點，即便他的 next 指向的是 `2`，但已無法被任何方式訪問 `1` 節點本身。
此時：節點 `1` 就變成了垃圾回收的候選對象，因為它不再有任何引用指向它；節點 `2` 和 `3` 仍然是可達的，因為它們是 BList 所指向的部分。

不被指向的節點 `1` 仍然會佔用記憶體空間，直到垃圾回收器（Garbage Collector）回收它們為止。
這些節點會保持在記憶體中，直到它們不再被引用並被垃圾回收器檢測到為止。

## 各有所長

來比較一下哪種競賽適合派誰出場：

### Random access & Search 隨機存取與搜索

#### Array

Keyword - find or search

適用 LeetCode 題目：
📌 LeetCode Problem: Two Sum (Easy) - #1
(Given an array, find two numbers that sum to a target value.)

日常範例：
📌 圖書館書架查找
📌 按照字母排列查找電話號碼聯絡人

Why：
按序排列查找已知索引的 `O(1)` 優勢

### Frequent insertions/deletions 頻繁操作插入/刪除

#### Linked List

Keyword - remove or insert

📌 LeetCode Problem: Remove Nth Node From End of List (Medium) - #19
(Remove the Nth node from the end of a linked list.)

Why：
從特定位置移除節點的 `O(1)` 優勢

# Linked List 延伸課題

- 反轉鏈結串列（Reverse Linked List）
- 合併兩個有序鏈結串列（Merge Two Sorted Lists）// 本文重點
- 找到鏈結串列的環（Linked List Cycle Detection）
- 刪除鏈結串列中的節點（Delete Node in a Linked List）
