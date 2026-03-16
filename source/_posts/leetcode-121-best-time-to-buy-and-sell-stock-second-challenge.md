---
title: （二度挑戰）優化演算法練習 Leetcode 121 Best Time to Buy and Sell Stock - Easy
date: 2026-03-04 23:30:00
tags:
  - Algorithm
  - Array
  - Sliding Window
  - Greedy
  - Javascript
  - Leetcode
categories:
  - Algorithm
  - Udemy learning
  - Leetcode
---

{% include_md %}
刷到 Best Time to Buy and Sell Stock 時，時隔一年竟然能一次挑戰成功！！這種成就感難以言喻...

<!-- more -->

# 拆解題目

## Best Time to Buy and Sell Stock

> You are given an array `prices` where `prices[i]` is the price of a given stock on the `i`th day.
> You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.

題目給一個股價陣列，代表每天的價格。

要做的事是：

```text
選一天買
再選未來某一天賣
求最大利潤
```

而且只能交易一次。

# 自我挑戰 — 一開始以為是枚舉所有可能

最直覺的想法當然是：

```text
每一天都當買點
往後看每一天當賣點
算最大差值
```

但這樣很明顯就是：

```text
O(n²)
```

我那時候心裡其實知道這題一定不該這樣做，只是還沒想到更自然的 O(n) 說法。

# 後來終於想到：這題其實是在比最低成本

某個瞬間我突然抓到一個比較有感的理解：「成本取最低 MIN、賣價取最高 MAX。」

<blockquote>
我不是在找「哪天買哪天賣」的所有組合，
而是在問：截至今天為止，歷史買過最便宜的是多少？如果今天賣掉，可以賺多少？
</blockquote>

這樣思路瞬間清楚很多。

也就是：

```text
一路往右掃
MIN -> 維護歷史最低買入價(Price)
MAX -> 同時更新最大利潤(Profit)
```

例如：

```text
[7,1,5,3,6,4]
```

走的過程會是：

| price | minPrice | profit | maxProfit |
| ----- | -------: | -----: | --------: |
| 7     |        7 |      0 |         0 |
| 1     |        1 |      0 |         0 |
| 5     |        1 |      4 |         4 |
| 3     |        1 |      2 |         4 |
| 6     |        1 |      5 |         5 |
| 4     |        1 |      3 |         5 |

最後答案就是：

```text
5
```

因為：

```text
1 買 6 賣
```

# 我自己的語言版本：最低成本思維

這題如果要我用自己的白話講，我現在會說：

```text
每看到一天的價格，
先問「到目前為止我買過最便宜的是多少？」
再問「如果今天賣掉，能賺多少？」
```

這個模型對我來說比背：

```js
maxProfit = Math.max(maxProfit, price - minPrice);
```

有感得多。

因為它真的很像投資直覺，不是純數學。

# 這題到底算 Sliding Window 嗎？

我中間也有想過：

```text
這題是不是 Sliding Window？
```

後來我的感覺比較像是：

- 它有一點雙指針 / window 的味道
- 但更準確地說，是「單次遍歷 + 維護最小值」

因為這題沒有像 Longest Substring 那樣真的需要收縮 window。

它比較像：

```text
一路掃描
維護 minPrice
更新 maxProfit
```

所以我現在會把它記成：

```text
最低成本題
```

而不是硬記分類。

# 解題程式

```js
var maxProfit = function (prices) {
  let minPrice = Infinity;
  let maxProfit = 0;

  for (const price of prices) {
    minPrice = Math.min(minPrice, price);
    maxProfit = Math.max(maxProfit, price - minPrice);
  }

  return maxProfit;
};
```

# 解題思路小記

這題我的腦內路徑大概是：

- 一開始想到雙層迴圈
- 但知道這樣太慢
- 想了一下才抓到「最低成本」這個模型
- 後來發現只要一路更新 `minPrice`
- 再算今天賣掉的獲利就好

所以最後其實是在做：

```text
minPrice = 迄今為止最便宜買點
maxProfit = 迄今為止最大利潤
```

# 解題後感想

這題讓我很有感的一點是：

```text
有時候演算法真正的突破不是公式，而是你找到一個自己聽得懂的說法
```

像我一開始如果只是死背：

```js
minPrice = Math.min(minPrice, price);
maxProfit = Math.max(maxProfit, price - minPrice);
```

過幾天大概又忘了。

但現在我會記成：

- 找最低成本
- 看今天賣掉能賺多少
- 一路更新最佳答案

這樣下次再看到這題，應該比較不會又從頭失憶一次。
