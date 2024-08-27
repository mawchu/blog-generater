---
title: Vue3 x Typescript knowhow 關於型別的兩三事
date: 2024-08-16 10:33:33
tags:
- Javascript
- Typescript
categries: Vue3
---

{% include_md %}
<!-- more -->

一直以來開發著 Javascript 弱型別語言養成許多不嚴謹的隱患，稍一不慎前後端資料協作下很可能導致資料錯誤而噴錯，藉著最近接觸著公司最新技術的專案架構來好好規範一下自己的壞毛病。
感謝公司的 Samuel 與 Bennett 大大帶著我飛，在 Vue3 X Typescript X Vite 的小宇宙挖壓挖......，對 Typescript 的學習在上一間公司是三天捕魚兩天曬網，以下記錄幾個蒐羅的重點整理。

# Call by reference should return function
由於 **傳參考特性(Call by reference)** 一直是前端各大框架監聽資料變化的重點對象，Array 與 Object 這類資料都需特別處理才能避免雷點。

## Vue define default props
在 Vue2 或者 Vue3 中都能注意到 **傳遞預設值(Default props)是以箭頭函式形式制定** ，這牽涉到上述的傳參考特性：
> The reason for this is to ensure that each instance of the component gets its own **unique copy of the object or array**, rather than all instances sharing the same reference.

### 範例說明

#### Enum X Type 自由切換
經前輩指點才發現了一個神奇寫法：
```ts
export enum ECallResultDialogType {
  Info = 'info',
  Success = 'success',
  Fail = 'fail',
}
export type TCallResultDialogType = `${ECallResultDialogType}`; // -------> Enum 與 Type 可以動態定義
```

#### 箭頭函式定義 default 對象
```js
import { type TCallResultDialogType, ECallResultDialogType } from 'Components/common/callResultDialog/types';

export interface IDialogModel {
  type: TCallResultDialogType; // -------> 一旦定義好了 Enum 限制的字串就不應是"非必要"
  title?: string;
  content?: string;
  extraLink?: string;
  okBtnText?: string;
  cancelBtnText?: string;
}

const props = withDefaults(
  defineProps<{
    dialogModel: IDialogModel;
    showExtraLink?: boolean;
    isLoading?: boolean;
  }>(),
  {
    dialogModel: () => ({ // ----------------> 物件的定義需要以箭頭函式形式
      type: ECallResultDialogType.Info,
      title: '',
      content: '',
      extraLink: '',
      okBtnText: '',
      cancelBtnText: '',
    }),
    showExtraLink: false,
    isLoading: false,
  }
);
```

物件型別的資料一旦建立就會有自己的傳參考位址，為了保持各元件再產生屬於自己的資料時都是一份獨立的拷貝對象，函式的執行環境是各自獨立的因此建立出來的資料也會切割出自己的傳參考不會互相分享，類似的概念可以套用在 React，看下一段。


## React inline function
對於 React 來說是更重視資料獨立性的框架，新手非常容易誤入「無限迴圈」的渲染漩渦，第一個我踩過的坑在[這一篇](/2024/04/06/react-onclick-event/)有詳細描述，重點就是為了保持元件在渲染階段後才執行函式並且傳入參數：
> 所以 React 在每次渲染創建的 inline arrow function 都是各自獨立的函式，與之前的參考脫鉤也就沒有資料改變的問題，從而解決了因為偵測變化而重新渲染的無限迴圈。

```js
<Link to={`/library`}>
  <Button
    onClick={() => changeCurrentTab("library")} // -----------> Here
    type={currentTab === "library" ? "primary" : ""}
  >
    LIBRARY
  </Button>
</Link>
```


其實 Vue3 演變到最後無論開發架構、概念還是資料流的處理應當都有與 React 借鏡不少，能感覺到開發的順手度越來越像了，不過資料與視圖締結的方式仍存在很大不同，React 嚴格遵循一率重繪而 Vue 則保持著 MVVM 的模式只更新部分影響視圖。

# 延伸閱讀
[TS 踩坑之路（四）之 Vue3](https://blog.csdn.net/qq_39490750/article/details/132171906)