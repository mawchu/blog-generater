---
title: Find & Remove 占用的埠號 :PORT
date: 2024-05-07 12:19:18
tags:
---

{% include_md %}
<!-- more -->

VSCODE 若沒有正確地按垃圾桶關閉 terminal、或者遇到視窗當機 的話，再次打開會發現 PORT 號是被佔領的狀態，以下筆記怎麼移除跟關閉被占用的 PORT：

# 打開 CMD 介面
開啟搜尋列輸入 cmd

# 尋找被占用的埠號 PORT TASK ID

```
netstat -ano | findstr :<PORT>
```

# 刪除與停止被占用的埠號 PORT TASK ID
```
taskkill /PID <PORT> /F
```

![mawchu-blog-find-and-remove-port](/images/find-and-remove-port-0.jpg)