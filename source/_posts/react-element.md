---
title: React 思維進化 - React Element X JSX
date: 2024-02-22 22:10:09
tags:
  - react
  - react思維進化
  - react-element
  - virtual-dom
  - browser-render
---

{% include_md %}

承襲上一篇『React 思維進化』核心理念的出發點——Virtual Dom 為基底，第二層的關鍵因素就是 React Element，筆者佔用了相當大的篇幅與頻繁地提及次數都在在彰顯其份量，可以從幾個粗淺但切中要害的方式分析：

<!-- more -->

# React Element 為構築畫面的最小單位

筆者從開頭就破題「組成 React 最小畫面的元素單位並非 component 而是 React Element」，以及「React Element 就是 React 實作 Virtual Dom 作為優化瀏覽器重新渲染造成的效能消耗必要手段之一。」來當作所有思維的基礎。

## Virtual Dom 是概念、React Element 是實作、DOM 是結果

Virtual Dom 的美好藍圖必須透過某些框架手法來轉換為現實，就是透過 React 的最小構築畫面單位——React Element，該方法可以傳入三個參數：

```
import React from 'react';
import ReactDOM from 'react-dom/client';

// 準備容器根節點(注意！該範圍內會直接為 React 所掌控與覆蓋，盡量避免直接透過其他 js 手法寫入此容器)
const rootContainerElement = document.getElementById('root-container');
const root = ReactDOM.creatRoot(rootContainerElement);

// 注入React Element
const buttonReactElement = React.creactElement(
    'button',           // 元素類型
    { id: 'button1' },  // 屬性值
    'I am a button'     // 子元素，可以往後傳入多個
)
```

產生的實際 DOM 樣貌：

```
<html>
    <head>
    ...
    </head>
    <body>
        <div id="root-container">
            <button id="button1">I am a button</button>
        </div>
    </body>
</html>
```

> React.creactElement 實際產生的是一個普通的 React javascript 物件，用來模擬實際產生的 DOM 樣貌，

## React Element Child 可以多個或嵌套

從第三個參數開始可以不斷透過 React Element 持續撰寫撰寫平行的兄弟、巢狀嵌套的父子等子元素：

```
const buttonReactElement = React.creactElement(
    'div',           // 元素類型
    { id: 'wrapper', className: 'wrapper' },  // 屬性值
    React.creactElement(  // 子元素，可以往後傳入多個
        'ul',
        { id: 'list' },
        React.creactElement('li', { className: 'list-item' }, 'item 1'),
        React.creactElement('li', { className: 'list-item' }, 'item 2'),
        React.creactElement('li', { className: 'list-item' }, 'item 3'),
    ),
    React.creactElement(
        'button',
        { id: 'button1' },
        'I am a button'
    )
    ...
)
```

## React Element 的 immutable 特性

為了實現效能優化，React 發展出不可變(immutable)的特性，每個產生的 React Element 都不能為後續的修改而變動，這是為了確保每個版本的 React Element 都有白紙黑字的根據，以便後續與新的版本做對照與比較(Diff)，進而方便 React 鎖定比較後的結構細節並且縮小範圍。

不過 React.creactElement 這樣的撰寫方式不夠直覺好懂，所以發展出第三個核心理念——JSX。

# JSX 菀菀類卿，除卻巫山不是雲

JSX 長得像 HTML、本質上卻是 Virtual DOM，這是因為如同 `class` 是 functional constructor 的語法糖一樣，他不過是 React Element 方法的語法糖，並非一個新的語言、也不是獨創的，撕開面具他不過就是透過 Babel 從高階語言轉換成另一個高階語言的「轉譯」(Transpiler)手法而已，讓你可以用 HTML 的概念去寫 Virtual DOM 並且呼叫 React.creactElement 方法，目的就是好維護、夠直觀。

透過 JSX 撰寫 React.creactElement：

```
const reactElement = (
    <div id="wrapper" className="wrapper">
        <ul id="list">
            <li className="list-item">item 1</li>
            <li className="list-item">item 2</li>
            <li className="list-item">item 3</li>
        </ul>
        <button id="button1">I am a button</button>
    </div>
)
```

> 避免與 `class` 重複而使用 `className` 並非 JSX 的規定，而是為了映射到 React.creactElement 呼叫時的寫法。

完全等同以下的寫法(Babel 轉譯結果)：

```

const buttonReactElement = React.creactElement(
    'div', // 元素類型
    { id: 'wrapper', className: 'wrapper' }, // 屬性值
    React.creactElement( // 子元素，可以往後傳入多個
        'ul',
        { id: 'list' },
        React.creactElement('li', { className: 'list-item' }, 'item 1'),
        React.creactElement('li', { className: 'list-item' }, 'item 2'),
        React.creactElement('li', { className: 'list-item' }, 'item 3'),
    ),
    React.creactElement(
        'button',
        { id: 'button1' },
        'I am a button'
    )
    ...
)

```

下一篇將跟隨『React 思維進化』筆者的引導，深入檢討 React 與 Vue 各自在優化前端效能上採用的做法，以及如何呼應到瀏覽器的渲染行為。
