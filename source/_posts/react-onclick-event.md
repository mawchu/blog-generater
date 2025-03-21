---
title: React 初學踩坑記 - onClick 事件的無限迴圈
date: 2024-04-06 22:47:03
tags:
  - react
  - inline function
  - one-way dataflow
  - onclick arguments
categories:
  - React
---

{% include_md %}
終於在前端生涯來到三年多後第一次接觸 React 開發，即便已經知道 React 容易踩坑無限迴圈的議題，仍然一頭栽了進去。
今天要來說說關於`「onClick 事件的無限迴圈」`，為什麼在 Vue 習以為常的開發手法卻在 React 踢爆鐵板呢？

<!-- more -->

抱持著踩坑的興奮心情與你各位分享ヾ(=`ω´=)ノ | |：

# React 的重新渲染機制

Vue 與 React 在運作機制上為了避免高耗能的 DOM 操作採取不同的做法，詳細可以閱讀 Zet 大大在《React 思維進化》中的解說。
總的來講，Vue 採用資料與視圖綁定的做法， MVVM 雙向綁定監聽資料變化以最小規模化操作牽動到的 DOM；React 則是採用了 React DOM 操作虛擬物件、一率重繪與單向資料流（One way dataflow）等多重手法來達成目的，這也造成 React 容易無限迴圈的主因。

# OnClick 事件傳入參數的日常

當我在開發一個簡易的路由切換，給當前按鈕改變顏色時秉持以往撰寫 Vue 的習慣：

```js
...
function Root() {
  const [currentTab, setCurrentTab] = useState("app");
  const changeCurrentTab = (tabName) => {
    setCurrentTab(tabName);
  };
  return (
    <>
      <h1>This is main page.</h1>
      <Space
        style={{
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        <Link to={`/app`}>
          <Button
            onClick={changeCurrentTab("app")}
            type={currentTab === "app" ? "primary" : ""}
          >
            APP
          </Button>
        </Link>
        <Link to={`/library`}>
          <Button
            onClick={changeCurrentTab("library")}
            type={currentTab === "library" ? "primary" : ""}
          >
            LIBRARY
          </Button>
        </Link>
      </Space>
      <Outlet />
    </>
  );
}

export default Root;

```

然後就沒有然後了，畫面直接死給你看：

<img class="post-image" style='margin-right: unset; margin-left: unset; padding-top: 12px' src='/blog/images/react-onclick-event-0.png' width='100%' height='auto'>

原因在於當前 Component 的 function 一旦`傳入參數`就視同於立即呼叫，時機在於 Component 渲染後觸發，這並不是我們預期「點擊後觸發」的行為，為了修正錯誤必須更改為箭頭函式以確保元件渲染的當下才定義函式，並且在需要的時候呼叫：

```js
...
function Root() {
  const [currentTab, setCurrentTab] = useState("app");
  const changeCurrentTab = (tabName) => {
    setCurrentTab(tabName);
  };
  return (
    <>
      <h1>This is main page.</h1>
      <Space
        style={{
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        <Link to={`/app`}>
          <Button
            onClick={() => changeCurrentTab("app")}
            type={currentTab === "app" ? "primary" : ""}
          >
            APP
          </Button>
        </Link>
        <Link to={`/library`}>
          <Button
            onClick={() => changeCurrentTab("library")}
            type={currentTab === "library" ? "primary" : ""}
          >
            LIBRARY
          </Button>
        </Link>
      </Space>
      <Outlet />
    </>
  );
}

export default Root;
```

這樣一來畫面的切換跟隨當前的按鈕操作囉！

詳細可以看[這一篇](https://sentry.io/answers/why-can-t-the-react-js-onclick-event-pass-a-value-to-a-method/)的說明

> When you call an onClick event handler function directly with an argument passed in, the function `is executed when the component is mounted`.
> An inline function is a function that’s`defined when the component is rendered`. This onClick event handler is now called by React only when the button is clicked by a user.

## 為什麼會造成無限迴圈

render 時觸發資料變化 -> re-render -> render 時觸發資料變化 -> re-render -> render 時觸發資料變化 -> re-render ...
於是造成了渲染渲染再渲染，重複重複再重複的死胡同裡面了。
<img class="post-image" style='margin-right: unset; margin-left: unset; padding-top: 12px' src='/blog/images/react-onclick-event-1.gif' width='80%' height='auto'>

> The reason why passing in a value to a state setter onClick event handler causes an infinite loop, if you call it without an inline function, is that the state is set when the component is rendered. `This causes the component to re-render as the state is updated`. The state is then set again when the component is re-rendered, which causes another re-render. This continues and causes an infinite loop.

## 為什麼 inline function 有解

Inline arrow function 之所以有效，在於他每一次的`函式執行環境都是「獨立的」`，對於 Javascript 來說 function 也是一種物件，物件的特性就是傳參考（by preference），所以 React 在每次渲染創建的 inline arrow function 都是各自獨立的函式，與之前的參考脫鉤也就沒有資料改變的問題，從而解決了因為偵測變化而重新渲染的無限迴圈。

> Using an inline arrow function helps resolve this issue. When you use an inline arrow function, a new function is created each time the component renders. This ensures that `the reference to the function changes`, which prevents the effect from re-rendering. - chatGpt

所以就結論而言，`傳入參數(passing arguments)`時必須使用 inline function 來呼叫才是正確做法！

# React router

接下來說說關於 router path 的兩三事，偵測 router path 改變當前頁面按鈕是很常見的使用者體驗優化，在 Vue.js 中很熟悉的做法就是 watch `$router` 變數來操作相應的邏輯，至於 React 則是透過 react-router-dom 套件中的`useLocation()` hook 去監聽路由切換與偵測。
延續上面的範例，為了讓頁面在指定的路由載入能正確的操作當前頁面按鈕的狀態與樣式，必須要在 React Element 重新渲染的初期就獲取路由名稱，採取相對應的樣式切換：

```js
...
import { Outlet, Link, useLocation } from "react-router-dom";

function Root() {
  const location = useLocation();
  const { pathname } = location;
  // 去掉 slash，並在元件渲染後直接變更當前按鈕
  const [currentTab, setCurrentTab] = useState(pathname.substring(1));

  const changeCurrentTab = (tabName) => {
    setCurrentTab(tabName);
  };

  return (
    <>
      <h1>This is main page.</h1>
      <Space
        style={{
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        <Link to={`/app`}>
          <Button
            onClick={() => changeCurrentTab("app")}
            type={currentTab === "app" ? "primary" : ""}
          >
            APP
          </Button>
        </Link>
        <Link to={`/library`}>
          <Button
            onClick={() => changeCurrentTab("library")}
            type={currentTab === "library" ? "primary" : ""}
          >
            LIBRARY
          </Button>
        </Link>
      </Space>
      <Outlet />
    </>
  );
}

export default Root;

```
