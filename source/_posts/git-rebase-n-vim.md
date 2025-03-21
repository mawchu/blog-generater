---
title: Git Rebase X Vim editor X Hexo 入門
date: 2025-03-18 11:07:42
tags:
  - Hexo
  - Git
  - Git Rebase
  - Vim
categories:
  - Git
---

{% include_md %}
本篇介紹一下操作 Git rebase 以及 Vim editor 的混合技，適用情境為某次的 commit 想棄用但已經在本次的 commit 之前。

<!-- more -->

<img style='margin-right: unset; margin-left: unset; padding-top: 12px' src='https://needone.app/content/images/size/w2000/2022/09/git-rebase-vs-git-merge.png' width='min(100%, 600px)' height='auto'>

# Git Rebase 前情提要

由於本次在 push commit 至遠端時 sourcetree 罕見地跳出 Error：

```
Pushing to github.com:mawchu/blog-generater.git
remote: error: GH013: Repository rule violations found for refs/heads/gh-pages.
remote: - GITHUB PUSH PROTECTION
remote:   —————————————————————————————————————————
remote:     Resolve the following violations before pushing again
remote:     - Push cannot contain secrets
remote:      (?) Learn how to resolve a blocked push
remote:      https://docs.github.com/code-security/secret-scanning/working-with-secret-scanning-and-push-protection/working-with-push-protection-from-the-command-line#resolving-a-blocked-push
remote:      (?) This repository does not have Secret Scanning enabled, but is eligible. Enable Secret Scanning to view and manage detected secrets.
remote:      Visit the repository settings page, https://github.com/mawchu/blog-generater/settings/security_analysis
remote:       —— GitHub Personal Access Token ——————————————————————
remote:        locations:
remote:          - commit: bf1d61b769dafbd3359b845a6d6c8aa6c8fa826b
remote:            path: _config.yml:132
remote:        (?) To push, remove secret from commit(s) or follow this URL to allow the secret.
remote:        https://github.com/mawchu/blog-generater/security/secret-scanning/unblock-secret/2uT9c8ujVk3xUd33a6aAjbXI5Xp
To github.com:mawchu/blog-generater.git
 ! [remote rejected] gh-pages -> gh-pages (push declined due to repository rule violations)
error: failed to push some refs to 'github.com:mawchu/blog-generater.git'
Completed with errors, see above
```

大致上的意思就是推送的 commit 中包含了敏感的金鑰資料(Secret)，為了防範有心人士的操作 Github 建立的推送的檢查機制。一直以來都是將推送專案的 Github Access Token 放在 \_config.yml 來完成部署，透過這次的警示訊息來矯正一下健康的開發習慣吧！

# 修改專案推送 Script

既然要避開敏感資料就務必要借助 `.env` 與 `dotenv` 老朋友來落實環境參數囉！

1. 首先在專案內安裝 `dotenv` 來讀取環境檔內的參數：

   ```
   npm install dotenv --save
   ```

2. 撰寫 `loadEnv.js` 來客製化回填 Token 至 `_config.yml` 的行為：

   ```
   require('dotenv').config();
   const fs = require('fs');
   const yaml = require('js-yaml');

   const configPath = './_config.yml';
   const config = yaml.load(fs.readFileSync(configPath, 'utf8'));

   if (process.env.GIT_DEPLOY_KEY) {
   config.deploy.repo = config.deploy.repo.replace('${GIT_DEPLOY_KEY}', process.env.GIT_DEPLOY_KEY);
   fs.writeFileSync(configPath, yaml.dump(config));
   console.log('🔑 Injected environment variables into _config.yml');
   }

   // Deploy Hexo
   const { execSync } = require('child_process');
   try {
   execSync('hexo clean && hexo generate && hexo deploy', { stdio: 'inherit' });
   console.log('🚀 Hexo deployed successfully');
   } catch (error) {
   console.error('❌ Deployment failed', error);
   }

   config.deploy.repo = config.deploy.repo.replace(process.env.GIT_DEPLOY_KEY, '${GIT_DEPLOY_KEY}');
   fs.writeFileSync(configPath, yaml.dump(config));
   console.log('🔄 Restored placeholder in _config.yml');
   ```

3. 將 ${GIT_DEPLOY_KEY} 填寫在 `.env` 檔案並加入 `gitignore`

   ```env
   GIT_DEPLOY_KEY=ghp_YOUR_ACCESS_TOKEN
   ```

4. 撰寫 `package.json` 的操作指令：
   ```json
   "scripts": {
       "launch": "node loadEnv.js"
   },
   ```

# Git Rebase X Vim 編輯器操作

由於 前一個 commit 上不小心已經包含了 Token 機敏資料無法一起推送上 origin，我選擇使用最簡單的 Git Rebase 方式 drop 掉包含機敏資料的 commit：

## Git Rebase script

確認本次要拋棄的 commit hex 代號並執行往前幾個：

```
git rebase -i HEAD~2
```

## Vim editor 編輯模式

執行後會進入 Vim editor 的檔案中顯示要執行 Git Rebase 的操作 commit：

```
pick bf1d61b add new posts
pick fec4281 add new posts & add env & script
```

第一個 commit 是這次預計拋棄的對象，執行步驟如下：

```
pick bf1d61b add new posts
pick fec4281 add new posts & add env & script
```

1. 按 <kbd>i</kbd> 進入 Vim 的 --INSERT-- 模式編輯
2. 將第一個 commit 指令修改為 "drop"，會在之後解決衝突時變成 “Current Change" 記得選擇 “Incoming Change" 後推送。
   ```
   drop bf1d61b add new posts // <---- change rebate script here
   pick fec4281 add new posts & add env & script
   ```
3. 編輯完畢後按 <kbd>esc</kbd> 鍵恢復普通模式，並輸入 `:wq` 儲存編輯並跳出。若不想儲存更改內容的話則輸入 `:q!` 強行跳出。

# 補充幾個 Vim editor 編輯模式的快捷鍵

<kbd>h</kbd> Move left
<kbd>j</kbd> Move down
<kbd>k</kbd> Move up
<kbd>l</kbd> Move right

以上步驟執行完就可以看到 commit tree 的改變並推送成功！
