---
title: 優化演算法練習 Leetcode 543 Diameter of Binary Tree - Easy
categories:
  - Algorithm
  - Udemy learning
  - Leetcode
date: "2026-03-16 22:40:00"
tags:
  - Algorithm
  - Tree
  - DFS
  - Recursion
  - Javascript
  - Leetcode
---

{% include_md %}

最近進入 Binary Tree 題型，原本以為只是 traversal 的變形，結果在 `Max Depth` 跟 `Diameter` 之間卡了很久。這篇記錄一下自己理解 Tree recursion 的過程。

<!-- more -->

# Tree 題一開始的困惑

一開始看到 Binary Tree 的表示方式：

    [3,9,20,null,null,15,7]

完全不知道在幹嘛。

後來才理解這其實是：

    Level Order（BFS）

也就是：

            3
           / \
          9   20
             /  \
            15   7

`null` 只是用來佔位，表示這個節點不存在。

但圖形畫法很容易讓人誤會，例如：

            3
           / \
          9   20
         / \  / \
       null null 15 7

我一度被這個排版搞混，以為 `7` 不在 `20` 下面。

後來才發現：

> Tree 的結構要看 parent-child 關係，而不是畫在圖上的「位置」。

# Tree traversal 的理解

最先碰到的是：

    Binary Tree Inorder Traversal

順序是：

    Left → Root → Right

例如：

        2
       / \
      1   3

結果會是：

    [1,2,3]

這題其實只是 **走訪節點順序**。

# Max Depth 開始出現 recursion

接著做：

    Max Depth of Binary Tree

這題的問題是：

    root 到最深 leaf 有幾層

第一次看到這行：

```js
return Math.max(left, right) + 1;
```

完全不懂為什麼要 `+1`。

後來才想清楚：

    left / right depth
    都不包含自己

所以要：

    子樹深度 + 自己

例如：

        1
       /
      2
     /
    3

計算過程：

    3 → depth = 1
    2 → depth = 2
    1 → depth = 3

所以公式其實是：

    depth(node) = max(leftDepth, rightDepth) + 1

# 直徑（Diameter）又是什麼？

接著遇到：

    Diameter of Binary Tree

題目問：

    樹中任意兩點之間最長的路徑

例如：

          1
         / \
        2   3
       / \
      4   5

最長路徑其實是：

    4 → 2 → 1 → 3

長度：

    3

這裡突然出現一個公式：

    leftDepth + rightDepth

一開始我完全不懂為什麼。

# Depth 和 Diameter 的關係

後來終於想通：

在某個節點：

          node
         /    \
     leftSub  rightSub

最長路徑可能是：

    左子樹最深 → node → 右子樹最深

所以：

    diameterThroughNode = leftDepth + rightDepth

# 為什麼 recursion 要回傳 depth？

這裡是我理解最久的一點。

原因其實很簡單：

    父節點需要知道子樹有多深，每一層子樹都需要回報自己的深度。

例如：

          1
         / \
        2   3
       /
      4

當節點 `1` 想算：

    leftDepth + rightDepth

它必須先知道：

    2 的子樹多深
    3 的子樹多深

所以子節點必須回傳：

    depth

# recursion 的兩件事

這題真正的重點是：

> 要把兩件事拆開。

## ① dfs 回傳 depth

```js
return Math.max(left, right) + 1;
```

意思是：

    從這個節點往下最深有幾層

## ② 同時更新 diameter

```js
max = Math.max(max, left + right);
```

這是：

    經過這個節點的最長路徑

最後整棵樹跑完：

    return max

# 最後整理出的模型

整個 recursion 其實就是：

    dfs(node)

做三件事：

    1. 算左子樹深度
    2. 算右子樹深度
    3. 用 left + right 更新最大直徑

最後回傳：

    max(left, right) + 1

告訴父節點：

    我這棵子樹有多深

# 解題程式

```js
var diameterOfBinaryTree = function (root) {
  let max = 0;

  const dfs = (node) => {
    if (!node) return 0;

    const left = dfs(node.left);
    const right = dfs(node.right);

    max = Math.max(max, left + right);

    return Math.max(left, right) + 1;
  };

  dfs(root);

  return max;
};
```

# 學習過程小記

這題其實讓我卡住很久的不是語法，而是理解：

    為什麼 recursion 要回傳 depth

現在終於比較清楚：

    DFS 回傳 depth
    父節點用 leftDepth + rightDepth 計算 diameter

而且 Tree recursion 其實都很像：

    子樹回傳資訊
    父節點利用資訊計算答案

理解這個套路之後，再看其他 Tree 題就比較不那麼恐怖了。

希望未來再回頭看這篇時，可以像 Two Sum 一樣變成「暖身題」。
