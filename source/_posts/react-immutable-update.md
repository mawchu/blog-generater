---
title: React 思維進化 - immutable update
date: 2024-04-17 16:08:09
tags:
- immutable update
- primitive & object
- immutable & mutable
- React 思維進化
---

{% include_md %}

《React 思維進化》已經閱讀到中間的核心章節了，作者提到一個與 Vue 框架在資料管理上比較不一樣的重要概念`Immutable`，由於 React 的單向資料流理念貫徹了整個框架系統，想當然爾會嚴格控制資料的可不可變也是十分合理的，javascript 在初學階段打下的基礎終於能與 React 框架結合起來，以下從 javascript 的資料型別切入：
<!-- more -->

# 習以為常的 Immutable
單就`Immutable`單詞來看解釋為「不可變的、永恆的」含意，延伸字`immortal`解釋為「不朽、長生不老的」，個人認為永恆不變是最適合也貼近本篇的討論概念。這樣的詞彙怎會與程式學習扯上關係呢？回憶一下當初學習 javascript 的基礎上—原始型別(primitive)與物件型別(object)。

## 原始型別(Primitive data type) 
特色為「獨立的」記憶體位置，不可複製參考，只是經常操作讓人習慣他的不可變，但其實一個變數名稱只能存取一個參考，複製時會建立一個獨立參考，彼此互不相關。
就像兩顆蘋果一樣，A 蘋果咬一口並不會影響 B 蘋果的樣貌，複製的方式為 `Call by value`。

屬於此型別的資料有以下：
- Number
- Boolean
- String
- Null(typeof null 時會回傳 object 但仍屬於原始型別)
- Undefined
- Symbol
- BigInt

## 物件型別(Object data type)
特色為「共享的」記憶體位置，可以複製參考，除了以上的原始型別以外的資料型態，都是物件型別。
就像地址或抽屜一樣，A 住在某某地址，B 也住在同一間房子；A 用 001 編號的抽屜，B 也使用 001 編號的抽屜。當 A 更動了房子裡的擺設、或是放進去抽屜裡一枝筆，B 都受到了一樣的影響，看見房子擺設改變、打開抽屜發現多一枝筆等等。

在電腦的角度來看就是記憶體位置相同，複製的方式為 `Call by reference`，可以使用(.)([])等 notation 操作來更改參考記憶體的資料內容。
> 補充說明：根據函式內是否對共享物件型別的資料並產生新的賦值行為(=)則可能為 `Call by sharing`，共享 A 的記憶體位置並且修改共享的物件參考資料，但給予 B 新的記憶體位址，雖然實務上很少這樣操作但仍存在這個說法。 

屬於此型別的資料有以下：
- Object type
    - Object
    - Function
    - Array
    - ... other excluded from primitive type

以上解釋完原始型別(primitive)的`immutable`與物件型別(primitive)的`mutable`，會發現初學時不容易理解的原因在於中文翻譯上不是那麼友善，在連結變不變跟記憶體位址關聯需要點上幾個核心的 javascript 概念樹，以及多多練習才能紮實並延伸應用到 React 上，甚至與 React Hooks 的 dependency 綁定是否直接使用 state，還是 state 的 property 有關，一直到多次渲染(re-render)耽誤到效能等議題，所以《React 思維進化》筆者 Zet 花費相當的章節說明這個觀念。

# React Immutable update
單向資料流的概念為保持資料源頭的一致性，根據當前資料的 snapshot 來創造一份新的 react element，而渲染的觸發的機制根據 ‵useState‵ 提供的 ‵setState‵ 方法來更新資料，繞過的話是不能觸發渲染更新的哦！

## Object.is() 判斷是否重新渲染
Object.is() 是 React 用來判定是否重新渲染的依據：

### Primative data 純值(原始型別)
純值(原始型別)較單純，比對不同就觸發渲染

<iframe height="300" style="width: 100%;" scrolling="no" title="React - immutable update" src="https://codepen.io/mawchu/embed/GRLYOvN?default-tab=js%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/mawchu/pen/GRLYOvN">
  React - immutable update</a> by Jamie Hsieh (<a href="https://codepen.io/mawchu">@mawchu</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

### Object data 物件型別
物件型別則是比對「每一層」的記憶體參考位址，一旦發現不同就觸發渲染，這裡就必須呼應本文主旨——Immutable update。
Mutable update 最常見的做法就是針對 Address 內的屬性值改變，會導致 React Hooks 沒有辦法察覺更新觸發渲染，或是丟失原始的歷史資料而比對異常等問題：

- use mutable updating
    使用 accessing reference 的方式污染資料，導致 react 重新渲染異常無法更改資料！
<iframe height="300" style="width: 100%;" scrolling="no" title="React - mutable update - object" src="https://codepen.io/mawchu/embed/vYMVdYV?default-tab=js%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/mawchu/pen/vYMVdYV">
  React - mutable update - object</a> by Jamie Hsieh (<a href="https://codepen.io/mawchu">@mawchu</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

- use immutable updating
    使用 updating function 的方式取得前一次(prev)的資料，並且更新資料參考使 react 重新渲染正常運作！
<iframe height="300" style="width: 100%;" scrolling="no" title="React - immutable update - object" src="https://codepen.io/mawchu/embed/VwNErVK?default-tab=js%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/mawchu/pen/VwNErVK">
  React - immutable update - object</a> by Jamie Hsieh (<a href="https://codepen.io/mawchu">@mawchu</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>