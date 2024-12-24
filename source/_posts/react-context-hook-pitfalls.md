---
title: React Context pitfalls - 踩雷經驗
date: 2024-12-24 12:05:07
tags:
---

{% include_md %}

即便之前有使用過 React Context 的鉤子經驗仍不可避免地在實際應用時遇到困難，本篇記錄下自己的使用踩坑經驗順便造福大眾 🤦‍♀️。

<!-- more -->

# 專案結構

## Project Structure

> Since we are using FreeMarker Java Template Engine(FTL), it would be a bit tricky to integrate React with it. In this article, I’m going to explain how to run and write React codes in our existing au-admin project.

簡單的介紹一下這次專案的結構，由於是從 MVC（Java）拉出來改造的前端庫所以結構上會有些與傳統建立的 React 專案不同，打包工具為 Craco，且各個模塊是區分團隊負責難免造成了元件、開發習慣跟使用技術上的差異，有純 Javascript、有 Typescript、有從舊邏輯拆出來也有新添加的業務邏輯頁面，呈現著一個各自為政的開發模式不是這次的討論重點，先聚焦在幾個技術應用的背景：

| Code format |         Data Management          | Api Management | Style pre-processor |
| :---------- | :------------------------------: | :------------- | :------------------ |
| Typescript  | useState, useContext, useReducer | Custom hooks   | less                |

## Component Structure

資料管理的應用很大一部分取決於元件的結構怎麼長，會影響到資料的傳遞深淺與方式，本次的專案結構最深達到 3 層所以對於簡單資料使用 `useState` 做基礎控制、表單操作較複雜的元件使用 `useReducer` 以物件形式管理資料，在三層元件共同使用與操作的資料對象使用 `useContext`，以下是元件的結構圖：
<img style='margin-right: unset; margin-left: unset; padding-top: 30px' src='/blog/images/react-context-hook-pitfalls-1.png' width='min(100%, 600px)' height='auto'>
當 props 來到第三層時仍需要操作共同的資料就不是那麼方便整潔，容易造成資料瀑布（Props drilling）的傳遞結構，容易造成不必要的資料傳遞，如圖：
<img style='margin-right: unset; margin-left: unset; padding-top: 30px' src='/blog/images/react-context-hook-pitfalls-2.jpg' width='min(100%, 600px)' height='auto' alt="https://ithelp.ithome.com.tw/articles/10336311" title="https://ithelp.ithome.com.tw/articles/10336311">

# 區分共用與獨立管理的資料

在業務邏輯上一定會有兩大類型的資料來影響元件的渲染：

## 獨立管理的資料

此類型資料只需要 scoped 在元件內部即可（拷貝的獨立參考），例如上圖的 SearchForm 表單資料、AddConfigModal 與 ConfirmToggleModal 各自的 Modal 開關或按鈕的 disabled 狀態等「不需要共用」或者「跨元件使用」的資料類型就可以簡便規範就好，其中表單適合使用物件形式來便利管理所以我使用 `useReducer`，而布林純值的簡單資料可以使用最原始的 `useState` 來操控。
<img style='margin-right: unset; margin-left: unset; padding-top: 30px' src='/blog/images/react-context-hook-pitfalls-3.jpg' width='min(100%, 600px)' height='auto'>

## 共用操作的資料

此類型資料前提為跨元件操控的對象（同一份資料參考）並且會影響一個以上的元件渲染時，就需要透過訂閱（Subscription）跟監聽（Observing）的行為來管理資料，適合的管理工具很多例如 Redux、Recoil 或者 Atom，但此次使用的業務邏輯是簡單的 CRUD 所以採用 React 官方提供的 useContext。
<img style='margin-right: unset; margin-left: unset; padding-top: 30px' src='/blog/images/react-context-hook-pitfalls-4.jpg' width='min(100%, 600px)' height='auto'>

# useContext intro

之前對於 useContext 有一篇文章[入門介紹](/blog/2024/05/02/react-useContext/)了簡易的使用方式，但偏偏沒有特別解釋到具體哪個環節才能開始使用 useContext 的資料導致了這一次的坑，來描述一下這次開發中遭遇的困難。

## 核心問題

### 建立 useContext 魔法陣

在 contexts 資料夾建立了一個共用資料中心並且引入 custom hooks（useQueryDatas）來管理 API 的邏輯避免每一次解構（destruction） custom hooks 的資料都造成新的參考，並且提升到 useContext scope 來實現多元件的共同訂閱與監聽：
<img style='margin-right: unset; margin-left: unset; padding-top: 30px' src='/blog/images/react-context-hook-pitfalls-5.jpg' width='min(100%, 600px)' height='auto'>

### 魔法啟用失敗

說得前面的鋪陳終於來到問題核心！若沒有將啟用資料的 Provider 移出獨立的 Function Component 中，並且將根部元件提取出來放置，從 Provider 提出的資料便不會有任何響應。
<img style='margin-right: unset; margin-left: unset; padding-top: 30px' src='/blog/images/react-context-hook-pitfalls-6.jpg' width='min(100%, 600px)' height='auto'>

一開始我將根部元件直接放置在 Function Component 也就是圖中黃線的位置，會發現 useContext 的資料呼叫任何一個 setState 都不會改動到 state，也就是沒有正確啟用該資料作用域，直到提取出去並將根部元件以子元件的形式包裹才終於使得共用 useContext 中的 state 開始作用！
這一段邏輯是取自其他團隊開發人員的結構直接使用，封裝出來的 Context 必須以 Children 形式傳進去才能正確啟用魔法陣。
