---
title: NX powerful monorepo tool - 前端微服務框架
date: 2024-08-27 16:15:06
categories: Structure
tags:
  - NX
  - monorepo
  - polyrepo
---

{% include_md %}
一次工作機會上偶遇了 NX 建置起來的 Monorepo 的專案架構，此時不記錄更待何時！

<!-- more -->

# NX 的誕生背景

當公司發展迅速到成熟階段時 **業務模型（Business model）** 通常會有既定運作框架，衍生許多附屬的品牌或者多樣的 **微前端服務（Micro Frontends）** 需要在此框架下進行維護（通常是庫 Repository），將組織的各種業務邏輯拆分成單元讓同仁分工又不耦合（Coupling）。
但每每建置整個專案架構都是多體庫（polyrepo）必須將設定重來一遍：前端框架、UI SCSS 主題、node modules、打包設定甚至到 CICD 等前期準備工作總是挺佔時間的，一方面專案之間共享套件又需要推上雲端（ex Npm），這時候 NX 就出現了！

> You can use Nx to
>
> - speed up your existing project's builds and tests, locally and on CI (whether that's a monorepo or standalone application)
> - quickly scaffold a new project (using Nx plugins) without having to configure any lower-level build tools
> - easily integrate new tooling (e.g., Storybook, Tailwind etc), into your project.
> - ensure consistency and code quality with custom generators and lint rules
> - update your frameworks and tools and keep your workspace evergreen using the automated code migration feature

# Monorepo 讓你一個庫解決所有專案

不同於多體庫（polyrepo）一個專案下就可以衍生多個業務邏輯與專案，根基在基礎架構下又不用重建真的減少許多不便也能讓開發人員不用重新熟悉，快快上手!

# Quickly scaffold 是核心優勢

個人覺得搭鷹架（scaffold）是專案最費時間的地方，如果能在既有框架下增加快速的新專案搭建時間對開發人員會大大的助益，以下是 NX 的架構圖：
<img class="post-image" style="margin-right: unset; margin-left: unset; padding-top: 12px" src="/blog/images/nx-intro-0.jpg">

應用的範圍很大，從 CI（Continuous Integration）持續整合到專案配置（前端框架、UI SCSS 主題、node modules、打包設定）、自動化測試、遷移（migration）與快取（cache），對於前端工程師來說應該是專案配置上的省事最有感，讓專案間共享設定與邏輯並且可以客製化。
