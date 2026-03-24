---
categories:
  - Algorithm
  - Leetcode
date: 2026-03-21 23:58:00
tags:
  - Algorithm
  - DFS
  - Tree
  - Recursion
  - Javascript
  - Leetcode
title: （二度卡關）演算法練習 Leetcode X Balanced Binary Tree - DFS
  深度理解與 -1 解法
---

{% include_md %}
這題我其實卡了一段時間，不是因為寫不出來，而是過程中踩了很多坑，而且有些錯誤其實滿低級的，但當下就是會卡住。

這篇把我實際卡過的點完整記錄下來，包含從錯誤寫法到理解 DFS 與 -1
解法的過程。

<!-- more -->

# 題目說明

110. Balanced Binary Tree (Easy)

> Given a binary tree, determine if it is height-balanced.

每個節點的左右子樹高度差不能超過 1。

---

# 我一開始踩過的坑

## 1. isBalanceTree 一開始設成 false

```js
let isBalanceTree = false;
```

這樣會導致結果永遠是 false。

正確應該是先假設是平衡的：

```js
let isBalanceTree = true;
```

---

## 2. !node 忘記回傳 0

```js
if (!node) return;
```

會導致後面拿到 undefined。

正確：

```js
if (!node) return 0;
```

---

## 3. 把 isBalanceTree 寫在內部

```js
let isBalanceTree = Math.abs(left - right) > 1;
```

每層都重新宣告，狀態失效。

---

## 4. 忘記呼叫 dfs(root)

```js
return isBalanceTree;
```

DFS 根本沒執行。

---

## 5. 傳錯 dfs(node)

應該是：

```js
dfs(root);
```

---

## 6. return 寫錯

```js
return Math.max(left - right) + 1;
```

應該是：

```js
return Math.max(left, right) + 1;
```

---

# 正確版本

```js
var isBalanced = function (root) {
  let isBalanceTree = true;

  const dfs = (node) => {
    if (!node) return 0;

    const left = dfs(node.left);
    const right = dfs(node.right);

    if (Math.abs(left - right) > 1) {
      isBalanceTree = false;
    }

    return Math.max(left, right) + 1;
  };

  dfs(root);
  return isBalanceTree;
};
```

---

# 為什麼是 DFS

因為高度只能從底往上算，所以一定是後序遍歷：

左 → 右 → 自己

---

# -1 解法

```js
var isBalanced = function (root) {
  const dfs = (node) => {
    if (!node) return 0;

    const left = dfs(node.left);
    if (left === -1) return -1;

    const right = dfs(node.right);
    if (right === -1) return -1;

    if (Math.abs(left - right) > 1) {
      return -1;
    }

    return Math.max(left, right) + 1;
  };

  return dfs(root) !== -1;
};
```

---

# abs \> 1 與 -1 的直覺理解

這裡我後來有一個比較直覺的理解。

樹的資料其實是一筆一筆插入的。如果某一邊持續比另一邊多延伸一層以上，整個結構就會開始往單邊傾斜。

當差距大於 1 的時候，其實就代表這棵樹已經開始「變形」，往某一側長成類似
linked list 的形狀。

也就是說：

- 平衡樹：高度分布接近
- 不平衡樹：某一邊一路往下串

所以當我們看到：

```js
Math.abs(left - right) > 1;
```

其實可以理解成：

這個節點的結構已經失去平衡，開始單邊肥大。

而 -1
的角色，就是把這個「已經壞掉的訊號」往上傳，讓整棵樹可以提早停止判斷。

---

# 我最後的理解

這題讓我真正理解 DFS 的一個關鍵：

DFS 不只是走訪節點，而是透過 recursion 把資訊一層一層往上傳。

當 return 不只是數值，而是「狀態 + 資訊」的時候，很多 tree
題就會開始變得好理解。
