---
title: React dependency & useMemo hook 用法
date: 2024-04-25 09:51:04
tags:
---

{% include_md %}

React Hooks 依據不同需求開發出的 Hooks，不管是 ˋuseEffectˋ、ˋuseMemoˋ、ˋuseCallbackˋ 等等都提供了第二參數**dependency**來控制「觸發鉤子的時機」，本篇特別說明依賴應用上自己混淆的地方，順一下思維邏輯上打結的點：
<!-- more -->

# dependency 的背後運作機制
當指定的資料放進 dependency array 時，會告訴 React 當該資料發生變化時啟動 `Object.is()` 比對前後資料，經判定有改變後 Hooks 內的程式碼片段就會被執行。
`Object.is()` 的比對思維類似於 `===` 強行別比對，關鍵的差異點在於以下情況：
- `Object.is()` 認定 -0 與 +0 不同，`===` 認定相同．


## `Object.is()` 比對的基準
`Object.is()` 再比對前後值時會因為 Primitive value 與 Object data 上有所不同：

### 當 `Object.is()` 比對純質
