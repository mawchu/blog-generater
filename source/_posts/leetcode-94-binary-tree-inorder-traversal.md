---
title: （二度挑戰）演算法練習 Leetcode 94 Binary Tree Inorder Traversal - Easy
date: 2026-03-12 22:40:00
tags:
  - Algorithm
  - DFS
  - Recursion
  - Tree
  - Javascript
  - Leetcode
categories:
  - Algorithm
  - Leetcode
---

{% include_md %}

第二次來理解這題的時候，驚嘆 ChatGpt 真的是一個好老師，用很清楚的說明一次教會我 PreOrder、InOrder、PostOrder...

<!-- more -->

# 題目說明

94. Binary Tree Inorder Traversal (Easy)

Given the `root` of a binary tree, return the _inorder traversal_ of its nodes' values.

## 範例

Example 1:

Input:

```js
root = [1, null, 2, 3];
```

Output:

```js
[1, 3, 2];
```

Explanation:

```js
[1, 3, 2];
```

# Binary Tree Inorder Traversal — 理解 DFS 的過程

這題表面上是 Tree traversal，但真正理解的是 DFS + recursion 的運作方式。

## 一開始的困惑

題目給的是：

```js
root = [1, null, 2, 3];
```

第一個沒看懂：

- root 看起來像 array
- 但函式參數卻是 TreeNode

其實 `[1,null,2,3]` 只是 LeetCode 用來描述樹的表示法（level order）。
真正傳入程式的是 TreeNode 結構：

```js
  1
   \
    2
   /
  3
```

所以 traversal 操作的是：

```js
node.val;
node.left;
node.right;
```

而不是 array index。

## Tree traversal 的核心

Binary Tree traversal 的本質其實就是 DFS（Depth First Search）。

DFS 的基本模板：

```js
function dfs(node) {
  if (!node) return;

  dfs(node.left);
  visit(node); // 記錄的時機
  dfs(node.right);
}
```

而 `visit(node)` 放在哪裡，決定 traversal 類型。

## 三種 traversal 的差別

DFS 在一個節點其實有 三個時刻：

```js
1. 剛到節點
2. 左子樹探索完
3. 右子樹探索完
```

對應 traversal：

| traversal | 記錄時間     |
| --------- | ------------ |
| Preorder  | 剛到節點     |
| Inorder   | 左子樹完成   |
| Postorder | 左右子樹完成 |

這裏是本文精華，也是我認爲最棒的說明：

```js
function dfs(node) {
  if (!node) return;

  console.log(node); // Preorder 在走左節點之前

  dfs(node.left);

  console.log(node); // Inorder 再走左節點之後

  dfs(node.right);

  console.log(node); // Postorder 再走右節點之後
}
```

---

# Inorder traversal 的直覺

Inorder 的規則是：

```js
left → root → right
```

實際 DFS 行為可以理解為：

<blockquote>
能往左就一直往左
走到底
開始記錄
再回溯
最後探索右邊
</blockquote>

很像走迷宮：

<blockquote>
一直往一條路走
走不通就回頭
再試另一條
</blockquote>

這其實就是 DFS + backtracking（回朔）。

---

# 遞迴是怎麼工作的

很多人會疑惑：

```js
dfs(node.left);
dfs(node.right);
```

看起來像同時執行，但其實程式是依照順序執行：

<blockquote>
先跑完整個左子樹 DFS
回來
再跑右子樹
</blockquote>

而 recursion 其實就是自動維護一個 call stack。

當遇到：

```js
if (!node) return;
```

代表：

<blockquote>
這條路走到盡頭
開始回溯
</blockquote>

---

# 最終解法

```js
var inorderTraversal = function (root) {
  const result = [];

  const dfs = (node) => {
    if (!node) return;

    dfs(node.left);
    result.push(node.val);
    dfs(node.right);
  };

  dfs(root);
  return result;
};
```

時間複雜度：

```js
O(n);
```

每個節點訪問一次。

空間複雜度：

```js
O(h);
```

來自 recursion stack。

# 這題真正學到的

這題的重點其實不是 traversal，而是理解：

- Tree traversal = DFS
- recursion = 自動 stack
- traversal 只是「記錄節點的時間點不同」

理解這個之後：

```js
Preorder;
Inorder;
Postorder;
```

其實只是 同一個 DFS 模板。

---

# 題後惡補

Binary Tree v.s. Binary Search Tree

普通 Binary Tree：

<blockquote>
節點數值沒有任何規律
</blockquote>

例如：

```js
    7
   / \
  3   9
 / \
8   1
```

Traversal 只是在 走完整棵樹。

---

# Binary Search Tree（BST）有規則

<blockquote>
left < root < right
</blockquote>

例如：

```js
     4
     / \
    2   6
   / \ / \
  1  3 5  7
```

這時候 Inorder traversal 會得到排序結果：

```js
1 2 3 4 5 6 7
```

---

# 解題後感想

這題最大的收穫其實不是 traversal，而是理解：

<blockquote>
Tree traversal = DFS
Recursion = 自動 stack
</blockquote>

而這個模式也會出現在很多演算法題，例如：

<blockquote>
Backtracking
Maze solving
Permutations
N-Queens
</blockquote>

本質其實都是 DFS + 回溯。

而 recursion 其實只是幫我們自動維護一個 call stack，記住「現在走到哪裡、要回到哪裡」。

這題雖然是 Easy，但其實是理解 Tree 與 DFS 思維很重要的一個基礎題。
