---
title: Vue3 
date: 2024-08-08 11:40:30
tags: javascript
categories:
- javascript
---

{% include_md %}
<!-- more -->

# 位元運算子
簡單介紹一下 **二元運算子**（位元運算子）在 Javascript 中的功用無非就是將 `0` 與 `1` 互相轉換，在 [mozilla 文章](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Guide/Expressions_and_operators#%E4%BD%8D%E5%85%83%E9%81%8B%E7%AE%97%E5%AD%90) 有詳細的說明，前端同學不一定能在職涯中常常遇見，但善用的話可能幫助提升效率。



## 波浪符號
維護公司專案時看到一段新穎的代碼所以來了興致，決定記錄下來這個冷門但奇淫的技巧以利自己往後看到能快速反應 XD。
``` js
    if (!eligible) {
        menu = menu.filter(menu => menu.name !== 'menu.apple');
    } else if (!apple.session && !apple.account) {
        menu = menu.map(item => {
        if (item.name === 'menu.apple') {
            ['menu.appleSeed', 'menu.appleLeaves'].forEach(name => {
                const childIndex = item.children.findIndex(submenu => submenu.name === name);
                if (~childIndex) item.children.splice(childIndex, 1);
            });
        }
        return item;
        });
    }

```

## 邏輯分析
程式碼中的波浪符號 `~` 成功地吸引了我的注意，專案眾多但第一次見到二元運算符在應用上的實際好處。
1. 從代碼結論判斷應是 `index !== -1` 時執行後方的運算
2. `if` 判斷顯示括弧內是布林值(Boolean)
3. 波浪符號 `~` 為位元運算符中的 **NOT**，Mozilla 解釋 **將運算元中的每個 bit 反轉(1->0,0->1)**。
4. `-1` 經過 NOT 轉換結果為`0`，透過布林值轉換為負值，不執行後方運算。

## 使用情境
`~(-1) = 0` & `~(0) = -1` 尋找索引值的運算非常適合此快速作法轉換。

## 雙波浪符號
在別人文章看到使用雙波浪號 `~~` 來轉型字串(String)為整數(Number)的作法，與 `Math.floor(123.45)` 大同小異，不過必須確保數值在安全範圍內，也就是 `-2147483648` ~ `+2147483648`。
