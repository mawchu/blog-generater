---
title: （深入理解）debounce 與 throttle 的時間模型與 this 流動
date: 2026-03-23 23:19:03
tags:
  - Javascript
  - Debounce
  - Throttle
  - EventLoop
  - Frontend
categories:
  - Javascript
---

{% include_md %}

今天本來只是想複習 debounce / throttle 手寫，結果一路從「會寫」直接鑽到「時間模型 + this 機制」，這種越學越深的感覺其實滿爽的 😂

<!-- more -->

# 起點：只是想搞懂 debounce / throttle

一開始的理解其實很單純：

```md
debounce → 停下來才做  
throttle → 過程中固定做
```

但寫著寫著就開始卡：

- 為什麼 throttle 有兩種寫法？
- timer vs timestamp 差在哪？
- 為什麼要 last = now？
- this 為什麼會壞？

---

# throttle 的關鍵突破：時間基準

最重要的理解在這裡👇

```js
if (now - last >= delay) {
  last = now;
  fn();
}
```

一開始不懂為什麼要：

```js
last = now;
```

後來想通：

```md
👉 last 是「上一次執行的時間」
👉 每次執行都要更新基準
```

用自己的話記：

```md
每次執行 → 把時間基準往前更新
```

---

# throttle 本質（今天最關鍵收穫）

```md
throttle 不是固定排程  
而是「條件放行」
```

也就是：

```md
✔ 至少間隔 delay 才能執行  
❌ 不是每 delay 一定執行
```

---

# debounce vs throttle（用 timer 角度理解）

這個理解超清楚👇

```md
debounce → timer 是「延後執行」  
throttle → timer 是「冷卻鎖」
```

對應 code：

```js
// debounce
clearTimeout(timer);
timer = setTimeout(fn, delay);

// throttle
if (timer) return;
timer = setTimeout(() => (timer = null), delay);
```

---

# this 問題（今天第二個大坑）

卡在這句：

```js
return function (...args) {
  fn.apply(this, args);
};
```

為什麼不能用 arrow？

---

## 核心理解

```md
function → this 看呼叫  
arrow → this 看定義
```

---

## debounce 裡的結構

```js
return function (...args) {
  setTimeout(() => {
    fn.apply(this, args);
  }, delay);
};
```

👉 關鍵：

```md
外層 function → 拿呼叫時的 this  
內層 arrow → 保住 this
```

---

# 更深一層：arrow function 的陷阱

如果 fn 是 arrow：

```js
debounce(300, () => {
  this.submit();
});
```

👉 就會壞掉：

```md
❌ this 無法被 apply 改
```

👉 得出結論：

```md
不用 this → 用 arrow  
用到 this → 用 function
```

---

# Vue2 vs Vue3 的聯想（意外收穫）

今天突然串起來：

```md
Vue2 → this 驅動  
Vue3 → closure 驅動
```

---

## Vue2

```js
this.submit();
```

👉 很依賴 this

---

## Vue3

```js
submit();
```

👉 完全不用 this

---

👉 所以：

```md
debounce + function 很像 Vue2  
debounce + arrow 很像 Vue3
```

---

# Event Loop 小補充

順便補了：

```md
setTimeout(fn, 0) ≠ 立即執行  
👉 是丟到 macrotask queue
```

---

# 今天最重要的三句話

```md
1. debounce 是「延後執行」
2. throttle 是「條件放行」
3. this 是看「怎麼呼叫」，不是看「怎麼寫」
```

---

# 心得（真實記錄）

一開始只是想複習題目，結果一路挖到：

- timer vs timestamp
- event loop
- this 綁定
- Vue 設計差異

有點像在拆一個很大的系統，每一層都連在一起。

---

# 下一步

```md
- 把 throttle（leading + trailing）合併寫法搞懂
- Vue scheduler 跟 event loop 的關係
- 補 Tree / 演算法節奏
```

---

# 收尾一句

```md
這題不是在寫 function  
是在理解「時間 + 事件 + 執行時機」
```
