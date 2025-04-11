---
title: 優化演算法練習 Leetcode X ListNode 資料結構 X Cycle
date: 2025-03-28 11:33:45
tags:
---

{% include_md %}
本題探討在 Linked List 中尋找是否存在循環節點的 Leetcode 題目，算是需要知道一點點附加知識才好解題的類型。

<!-- more -->

拆解本題之前需要具備先決知識：[優化演算法練習 Leetcode X ListNode 資料結構](/blog/2025/03/23/leetcode-listnode-data-structure)

# 拆解題目

141. Linked List Cycle

Given `head`, the head of a `linked list`, determine if the linked list has a `cycle` in it.

There is a `cycle` in a linked list if there is some node in the list that **can be reached again** by continuously following the next pointer. Internally, pos is used to denote the index of the node that tail's next pointer is connected to. Note that pos is not passed as a parameter
Return true if there is a cycle in the linked list. Otherwise, return false.

<img style='margin-right: unset; margin-left: unset; padding-top: 30px' src='/blog/images/leetcode-linked-list-hascycle-0.jpg' width='min(100%, 600px)' height='auto'>

Follow up: Can you solve it using O(1) (i.e. constant) memory?

# 分析題目

說到循環節點(Cycle)會聯想到什麼？

最近本人在看動漫「チ。地球の運動について」關於地球運動與宇宙關係中很自然的聯想到一點：地球與火星的運轉軌跡。

地球與火星都會圍繞著太陽運。其中，火星的公轉速度要相較於地球慢，詳細的天文知識就不去詳述了若有錯誤還請見諒 XD
這次的解題重點在於某一集神職人員在與助手解說：「在地球上看到火星的倒退行為是因為地球也在進行公轉」時給我電閃雷鳴的醍醐灌頂，這不就是一種循環嗎？

<img style='margin-right: unset; margin-left: unset; padding-top: 30px' src='https://yomitai.jp/wp-content/uploads/2024/12/6258b588141de38717c8bbef170d906f-scaled-e1733383582519.jpg' width='min(100%, 600px)' height='auto'>

之所以站在地球視角會看到火星倒退就是因為地球的公轉軌道在同一圈上已經超越了火星，而且火星的軌道圈大於地球這個不談，此情境完全符合這個題目要求的 **「終究相遇」**。

離題好像太遠了，總之這次的運算需要準備幾個前提協助完成題目。

## Tortoise and Hare 龜兔賽跑

此概念來自於 Floyd's Algorithm (弗洛伊德演算法):

1. 運用兩個指標（pointers）來遍歷鏈表：

   - 慢指標（slow, 也叫 tortoise / 烏龜） 每次走 一步 -> 也可以類比為這次的火星
   - 快指標（fast, 也叫 hare / 兔子） 每次走 兩步 -> 也可以類比為這次的地球

2. 如果鏈上存在閉環則兩個指標 **「終究相遇」**。
3. 如果鏈上不存在閉環則快指標終將先一步走到 `null`。
4. 起跑點必須一致。

## 解題邏輯

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */

/**
 * @param {ListNode} head
 * @return {boolean}
 */
var hasCycle = function (head) {
  if (!head || !head.next) return false;
  // start from same point
  let mars = head; // slow
  let earth = head; // fast
  while (earth && earth.next !== null) {
    // make sure in circle
    mars = mars.next;
    earth = earth.next.next;
    if (mars === earth) return true; // would meet somewhere if has circle
  }
  return false;
};
```

## 解題卡點

由於對鏈結串列的節點傳參考一直不參透，對於幾個點一直打結：

### Node 物件與 Next 都是節點本身

每個節點都指向下一個節點，本身包含了 `value` 以及 `next`，其中每個本身（包含著 `value` 以及 `next`）節點同時也是前一個節點的 `next`，所以 ` if (mars === earth) return true;` 這段邏輯指的就是比對當前節點 **參考(reference)** 是不是相同。

> 可以把鏈結串列想成一串物件，每個物件(節點 Node)都包含著指標(指向下一個物件)。

### 起跑點必須相同

相同起跑點才能拉出差異並且如果存在閉環最終必定相遇。

### 閉環內的指標不會指到 Null

規律走訪的邏輯如果存在閉環永遠都能指向下一個節點而非 `null`。
