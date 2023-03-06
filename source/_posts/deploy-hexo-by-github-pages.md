---
title: 部署 Ｈexo 部落格至 Github Pages
date: 2023-02-25 20:20:41
tags:
---

# 前言提要
建置 Hexo 部落格已經兩年多，如今更換 Ｍac 之後建制的新環境 Node 版本已經不相容，peer packages 貼心的設計也種下了難以收拾的坑 （難解的 sass loader），舊的部落格所選用的 Minos 框架在少數的使用量與停止維護下造就了相容性衝突也是在所難免，如今只能硬著頭皮重新學習建置一包 Hexo 了。
踩過的坑我們懂得避免，這次選用最多人使用與維護的 ＮexT 模板作為新部落格的皮膚。

# 建立 ＮexT 主題專案包
NexT 建置了貼心的官網提供完整的說明，[點我](https://theme-next.js.org)。
再建置好 Hexo 專案包後，執行以下命令取得 ＮexT theme。

``` bash
$ cd hexo-site
$ npm install hexo-theme-next
  ```

#### 更換 __config.yml 主題
將 Hexo 專案根目錄下的 __config.yml 配置更改為：
``` bash
$ theme: next
  ```
#### 新增部落格文章
cd 至專案目錄後，透過以下指令建立文章：
``` bash
$ hexo new post your-post-name
  ```

# 如何搭配 Github pages 部署網站
先說我個人的案例，去年第一個部落格我的做法是去建立新的 Github 帳號，將專案直接部署在 <my-name>.github.io 的 repository 上，原因是個人帳號的 github.io 已經被舊專案所佔據了，這個做法不是很好，白白浪費了舊帳號的 pages 空間。於是乎在新部落格建置後決定好好利用舊帳號的 Github pages。
原先在 google 搜尋引擎上查不太到好的解法，所以就求救了 ChatGpt 老師～，沒想到各種問題都能一一擊破，真的是太厲害了！

#### 建立新的 Git repository
去想要使用的 Account 建立一個新的倉庫，並且隨意命名，我使用 blog 這個名稱當作主網站的 router。

#### 專案包中安裝自動部署工具
cd 至專案包路徑後，執行以下的命令安裝 Hexo 自動部署工具。
``` bash
$ npm install hexo-deployer-git --save
  ```

#### 連結 Github repository 至部落格
cd 開啟專案中的 __config.yml 檔案改寫以下內容：
``` bash
deploy:
  type: git
  repo: https://github.com/your-username/blog.git
  branch: gh-pages
  tkn: your-pat-tkn
  ```
直得注意的是分支 `gh-pages` 會為 github 部屬時自動辨別為子專案使用，待下一個步驟設定完成並建立後將子專案推至此分支。
<img style="margin-right: unset; margin-left: unset; padding-top: 30px" src="/blog/images/deploy-hexo-by-github-pages-1.jpg"  width="80%" height="auto">

#### 事前作業
為了讓 url 可以指向正確的路徑，需要調整 `__config.yml` 中的幾個設定：

##### url
``` bash
# URL
    url: https://user-name.github.io/blog
    root: /
  ```
#### public dir
調整發布的資料夾名稱為 docs，在部署後會自動建立一個資料夾名稱為 docs。
``` bash
# Directory
    source_dir: source
    public_dir: docs
  ```

執行命令建立該資料夾：
``` bash
$ hexo generate
  ```

##### 錯誤處理
在部署後有發生錯誤訊息：
``` bash
$ github-pages 228 | Error: No such file or directory @ dir_chdir - /github/workspace/docs
  ```

ChatGpt 的回覆：
``` bash
You can also update the url setting in your Hexo project's _config.yml file to match your new deployment environment. For example, if your site is deployed to https://your-username.github.io/blog, you can update your url setting like this:
  ```
原因是我忘了將上一個步驟中的 url 指向調整到 `/blog`，導致網站開啟後 css 與 javascript 直接掛掉找不到路徑。
將這一段調整後重新操作部署指令：
``` bash
$ hexo clean && hexo generate && hexo deploy
  ```
就可以在子路由中看到 Hexo 部落格搭建好囉！完美的與舊專案並存在 github.io domain 下啦！

# 參考網站
 [從零開始 用 github pages 上傳靜態網站](https://medium.com/進擊的-git-git-git/從零開始-用github-pages-上傳靜態網站-fa2ae83e6276)
 [ChatGpt](https://chat.openai.com/chat/)