---
title: （二度挑戰）優化演算法練習 Leetcode 94 Binary Tree Inorder Traversal - Easy
date: 2026-03-09 23:10:00
tags:
  - Algorithm
  - Tree
  - DFS
  - Recursion
  - Javascript
  - Leetcode
categories:
  - Algorithm
  - Udemy learning
  - Leetcode
---

{% include_md %}
最近開始進 Tree 題，原本以為只是換個資料結構，結果一看到題目給的樹圖跟 array 表示法，腦袋就先打結一半。

這篇先記錄一下 Binary Tree Inorder Traversal 的理解過程，因為它看起來只是「走訪」，但對我來說其實是搞懂 Tree 題的入口。

<!-- more -->

# 拆解題目

## Binary Tree Inorder Traversal

> Given the `root` of a binary tree, return the inorder traversal of its nodes' values.

題目要我回傳一棵 binary tree 的 inorder traversal 結果。

但我一開始看到 `inorder` 根本沒有直覺，只知道它好像是 Tree traversal 的其中一種，腦中只剩下：

- preorder
- inorder
- postorder

但到底誰先誰後，真的會瞬間失憶。

# 自我挑戰 — Tree 題的第一個卡點不是程式，是看懂樹

這題最先卡住我的，不是 recursion，也不是 traversal，而是：

```text
[3,9,20,null,null,15,7]
```

這個到底在表達什麼。

一開始我會被圖的位置騙到，尤其是像下面這種感覺：

```text
        3
       / \
      9   20
     / \  / \
   null null 15 7
```

我腦中會冒出很多奇怪問題：

- 為什麼 `null null` 明明寫在 `20` 後面，卻算在 `9` 那邊？
- `7` 看起來沒有正正站在 `20` 下面，為什麼還算是 `20` 的 child？
- 這到底是圖形位置重要，還是 array 順序重要？

後來才慢慢釐清：

<blockquote>
LeetCode 這種 Tree 的 array 表示法，其實是 Level Order，也就是 BFS 一層一層排下來。  
重點不是圖看起來怎麼擺，而是 parent-child 對應關係。
</blockquote>

也就是說：

```text
[3,9,20,null,null,15,7]
```

其實表示的是：

```text
        3
       / \
      9   20
         /  \
        15   7
```

`9` 的左右 child 都不存在，只是 LeetCode 沒把 `null` 畫出來而已。

這一段真的卡很久，但一旦想通，就會知道：

```text
Tree 題不能太相信圖的物理位置，要相信結構。
```

# Inorder 到底是什麼順序？

| Traversal     | 規律         | 記法            |
| ------------- | ------------ | --------------- |
| **Preorder**  | 根 → 左 → 右 | Root Left Right |
| **Inorder**   | 左 → 根 → 右 | Left Root Right |
| **Postorder** | 左 → 右 → 根 | Left Right Root |

工程師很好記的方式

把 root 想像成一個 console.log 的位置：

```js
function dfs(node) {
  console.log(node); // Preorder

  dfs(node.left);

  console.log(node); // Inorder

  dfs(node.right);

  console.log(node); // Postorder
}
```

````

不是背英文名字，而是直接把順序寫出來。

例如這棵樹：

```text
    2
   / \
  1   3
````

Inorder traversal 就是：

```text
1 → 2 → 3
```

也就是：

1. 先去左邊
2. 再處理自己
3. 最後去右邊

# 走訪順序 != 記錄時機

這一點在剛開始學 Tree 很容易搞混，所以我們開始聚焦「記錄時機」。

如果題目要回傳陣列，那就還是要：

```js
result.push(node.val);
```

所以 traversal 題其實很像是：

```text
走訪節點 + 記錄順序
```

而不是單純走過去而已。

# recursion 其實還沒很難，難的是知道什麼時候 push

這題的 recursion 架構其實很簡單：

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

但這題真正的重點不是語法，而是：

```text
什麼時候記錄 node.val
```

如果是 inorder，就要放在：

```text
左邊跑完之後，右邊之前
```

也就是這一行：

```js
result.push(node.val);
```

的位置。

# 解題思路小記

我這題的腦內流程其實很亂：

- array 表示法看不懂
- 圖的位置在誤導我
- inorder 到底是哪個順序
- `console.log` 算不算記錄
- 原來 traversal 題的重點是 push 的時機

後來才慢慢整理出來：

```text
LeetCode 的 tree array 是 BFS level order
Inorder 是 左 → 根 → 右
Traversal 題是在走訪節點，並依規則把值記錄起來
```

# 解題後感想

這題看起來很基礎，但其實對我來說它是：

```text
真正開始理解 Tree 題的第一步
```

以前會覺得 Tree traversal 就是背三種順序，但這次重新寫之後，才比較真的理解：

- Tree 結構怎麼看
- `null` 代表什麼
- inorder 到底是在幹嘛
- recursion 裡哪一行是在「記錄」

有時候簡單題真正難的不是解法，而是把那些原本模糊的概念真的釐清。

希望之後再看到 Tree 題時，不會先被圖嚇到。
