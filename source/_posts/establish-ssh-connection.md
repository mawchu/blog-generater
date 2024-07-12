---
title: 如何與 server 進行 ssh 連線
date: 2023-03-05 20:06:31
tags:
- ssh
- rsa
- publicKey
- privateKey
categories:
- SSH
---

{% include_md %}

# 產生本機電腦的公私鑰
進入本地終端機後，輸入以下的命令就可以在 user （或者是設定的登入id）資料夾自動產生隱藏的 `.ssh` 資料夾中一組公（public key）私 (private key)鑰。

<!-- more -->

## ssh cmd
``` bash
$ ssh-keygen -t rsa
  ```
``` bash
$ ssh-keygen -b 4096
  ```
其中的 `-t` 為公私鑰的類型 type； `-b` 為鑰匙的長度大小 bytes。
產生之後將得到的**私鑰**保存好並且記得在連線時輸入，**公鑰**則提供給系統管理員進行權限的設定。

## 查看產生的 SSH Key
<img style='margin-right: unset; margin-left: unset; padding-top: 30px' src='/blog/images/establish-ssh-connection-9.jpg' width='80%' height='auto'>
1. Ubuntu (WSL2)：`\\wsl.localhost\Ubuntu\home\${username}\.ssh`。 

<img style='margin-right: unset; margin-left: unset; padding-top: 30px' src='/blog/images/establish-ssh-connection-10.jpg' width='80%' height='auto'>
2. 點開可以查看到私鑰(Private Key)。 

# 取得 FileZilla 連線
去 FileZilla 下載應用程式，協定選擇 SFTP - SSH file transfer protocol、登入形式選擇金鑰檔案，輸入伺服器的 ipv4、伺服器方設定好的 id、以及私鑰密碼檔案路徑後就可以進行連線。
<img style='margin-right: unset; margin-left: unset; padding-top: 30px' src='/blog/images/establish-ssh-connection-1.jpg' width='80%' height='auto'>

# 下載 vscode remote - ssh 套件
若能在開發時直接與伺服器連線就可以省去手動上傳檔案的麻煩，首先至 vscode 的套件市場下載並安裝 remote - ssh，按照以下步驟完成連線與設定：
<img style='margin-right: unset; margin-left: unset; padding-top: 30px' src='/blog/images/establish-ssh-connection-2.jpg' width='80%' height='auto'>
## mac pro 按下 <kbd>fn</kbd> + <kbd>f1</kbd>
開啟 vscode 的 f1 後在終端機輸入 Remote - ssh: Add New SSH Host...
<img style='margin-right: unset; margin-left: unset; padding-top: 30px' src='/blog/images/establish-ssh-connection-3.jpg' width='80%' height='auto'>

## 輸入 userId 與 server ip 連線 SHH
例如以下的格式：
``` bash
$ mawchu@192.123.45.678
  ```
按下 enter 後就可以在左邊的側欄控制面板看見連線的伺服器：
<img style='margin-right: unset; margin-left: unset; padding-top: 30px' src='/blog/images/establish-ssh-connection-4.jpg' width='80%' height='auto'>

## 錯誤處理
若連線伺服器後無法對檔案新增或刪除等寫入功能，可以進行以下設定，終端機輸入：
``` bash
$ ssh-add <path-to-private-key>
  ```
路徑為使用者根目錄下的隱藏資料夾，路徑可輸入：
``` bash
$ ssh-add ~/.ssh/id_rsa
  ```
確認私鑰密碼是否正確可以輸入以下的命令行查看：
``` bash
$ ssh-add -l
  ```

## 切換專案資料夾
點選左下角的遠端伺服器 ip，連線到主機後出現選擇資料夾，就可以隨意切換想要的路徑：
<img style='margin-right: unset; margin-left: unset; padding-top: 30px' src='/blog/images/establish-ssh-connection-5.jpg' width='80%' height='auto'>

# 在 Gitbucket 應用 SSH Keys
<img style='margin-right: unset; margin-left: unset; padding-top: 30px' src='/blog/images/establish-ssh-connection-11.jpg' width='80%' height='auto'>
使用 Terminal vim 指令打開 pub 公鑰檔案

## 使用 Vim 取得公鑰 rsa
<img style='margin-right: unset; margin-left: unset; padding-top: 30px' src='/blog/images/establish-ssh-connection-12.jpg' width='80%' height='auto'>

### 打開檔案複製。
#### 安裝 clipboard 套件
  1. 安裝跨軟體複製貼上 clipboard 套件：
  ```bash
    vim --version | grep clipboard
  ```
  2. 若顯示 `-clipboard` & `-xterm_clipboard` 則需要安裝，否則複製 yank 會失效。
  ```bash
    -clipboard         +keymap            +printer           +vertsplit
    +eval              -mouse_jsbterm     -sun_workshop      -xterm_clipboard
  ```
  3. Ubuntu sudo 安裝指令
  ```bash
    sudo apt install vim-gtk3 # go for vim-gtk if vim-gtk3 is not available
  ```
#### 全選公鑰
  <kbd>g</kbd> <kbd>g</kbd> <kbd>V</kbd> <kbd>G</kbd> 全選
  <kbd>"</kbd> <kbd>+</kbd> <kbd>y</kbd> 複製(Yank)
```bash
  vim id_rsa.pub
```

### 前往 Gitbucket 設定 SSH Keys
<img style='margin-right: unset; margin-left: unset; padding-top: 30px' src='/blog/images/establish-ssh-connection-6.jpg' width='80%' height='auto'>
1. 個人頭像 > 齒輪 > 個人化設定
<img style='margin-right: unset; margin-left: unset; padding-top: 30px' src='/blog/images/establish-ssh-connection-7.jpg' width='80%' height='auto'>
2. SSH keys > Add key > 將公鑰貼上 > 命名
<img style='margin-right: unset; margin-left: unset; padding-top: 30px' src='/blog/images/establish-ssh-connection-8.jpg' width='80%' height='auto'>
3. 將公鑰貼上 > 命名