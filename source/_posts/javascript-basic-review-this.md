---
title: 回顧 JavaScript 核心 X Basic Review - This
date: 2025-04-27 15:21:30
categories: Frontend Interview
tags:
- JavaScript
- This
- Execution context
---

{% include_md %}
本篇複習關於 JavaScript 最基礎的知識點：**This**、**Execution Context**。
<!-- more -->

# This 之於前端
關於 **This** 的指向可以說是入門前端工程師第一大門檻也不誇張，理解他可以游刃有餘的在各種執行環境(Execution context)深度利用，不理解他很可能會導致結果不如預期或者除錯困難。

## This 誕生於執行環境當下
JavaScript 每逢同步函式(Sync Function)呼叫(Function Calling)會產生 **執行環境(Execution context)** 並推送至 **執行堆疊(Execution Stack)** 上，當前執行環境的 `this` 則誕生。

執行堆疊按照 **後進先出(Last in first out)** 的順序完成每一個執行環境，一但遇到異步執行函式(Async Function)由 **事件迴圈(Event Loop)** 再度推送至執行佇列(Execution queue、Event Loop)。

<img style='margin-right: unset; margin-left: unset; padding-top: 30px' src='/blog/images/javascript-basic-review-01-00.png' width='100%' height='auto'>

即使每個函式的執行當下產生當前環境的 `this` 也不代表會指向函式的作用域(Lexical scope)本身，而是關係在 **呼叫的方式**。

# This 的四大綁定規則

函式呼叫的當下，透過以下四種方式決定 This 綁定誰：

## 明確綁定(Explicit Binding)

透過 ES5 老朋友 `Call`、`Apply`、`Bind` 綁定的 This：

- call、apply
    可以直接呼叫，call 接受解構參數：apply接受陣列參數。
    ```js
        fn.call(bindObj, ...arguments)
        fn.apply(bindObj, [...arguments])
    ```

- bind 會產生一個拷貝函式
    需要透過另一個函式表達式回傳結果，或者是使用雙括弧，條件是只能綁定一次。
    ```js
        fn.bind()()
    ```
    > Vue 2 中其實內部有做一些 methods 綁定 this 的處理（像是自動 bind），所以在 Vue 中用 methods，基本上 this 穩穩是指向 Vue instance。

## 隱式綁定(Implicit Binding)

就是透過 **物件的方法呼叫** 來改變綁定的 This，如上述的內容：

```js
const obj = {
  name: `Object`,
  getThis
}

obj.getThis(); //Object
```

### new 呼叫規則(new Binding)

等同上面提到的 **new Vue**，當 new 一個實例的當下就綁定了 This：
```js
function Person (name) {
    this.name = name; // 等同於 Class constructor
}
const p = new Person('Mawchu');
console.log(p.person); //'Mawchu'
```
### 為什麼搞懂 This 很重要
進入前端產業後應用框架加快開發的模式不可避免，尤其學習 Vue 不外乎就是透過 **建構器(constructor)** 的方式建立一個 Vue，起手式如下：

```js
const app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue 2!'
  }
});
```

### Class 語法糖就是建立物件
由於 JavaScript 的類(Class)應用不外乎就是借用物件特性的 `this` 來建構一個實例(Instance)，那麼理所當然內部的一切資料(data)、方法(methods)、生命週期鉤子(Life Cycle Hooks)也都是運用簡易呼叫的表達式函式來綁定，應用起來自然也就等同於指向物件本身的 Vue 實例自己了。


### 指向物件本身(Object)

若函式的呼叫方式透過 **物件方法(Methods)** 呼叫 ，那麼 `this` 就會指向 **物件本身**。

```js
var name = `Global`

function getThis() {
  console.log(this.name) 
}

getThis(); //Global

const obj = {
  name: `Object`,
  getThis
}

obj.getThis(); //Object
```

## 預設綁定(Default Binding)

### 簡單呼叫的 this

不依附物件也不透過綁定的方式呼叫，都可以稱作簡單呼叫：

### 嚴格模式的 this

若函式的呼叫方式透過 **嚴格模式下(use strict)** 最基本的 **簡易呼叫(Simple Calling)** ，那麼 `this` 就會指向 `undefined`。

```js
"use strict";
var name = `Global`

function getThis() {
  console.log(this.name) 
}

getThis(); //Uncaught TypeError: Cannot read properties of undefined (reading 'name')
```

### 非嚴格模式的 this

若函式的呼叫方式透過 **非嚴格模式下(use strict)** 最基本的 **簡易呼叫(Simple Calling)** ，那麼 `this` 就會指向全域執行環境(Global)：

```js
var name = `Global`

function getThis() {
  console.log(this.name) 
}

getThis(); // Uncaught TypeError: Cannot read properties of undefined (reading 'name')
```

#### IIFE 立即自我呼叫函式

```js
(function () {
  console.log(this) // 行為等同 嚴格模式的 this -> undefined & 非嚴格模式的 this -> Window
}())
```


