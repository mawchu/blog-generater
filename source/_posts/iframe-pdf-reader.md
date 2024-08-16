---
title: iframe 嵌入 PDF Reader
date: 2024-05-07 10:31:46
tags:
- iframe
- pdf
categories:
- frontend
---

{% include_md %}
<!-- more -->

這篇記錄一下合約更新後提供 PDF 閱讀器提醒使用者合約條款更新的優雅作法，以為很難其實超簡單！

# 準備一個 iframe
常見場景是使用一個彈出視窗提醒使用者閱畢後同意條款，簡單的展示一下結構。
{% codeblock lang:javascript %}
<Dialog>
    <iframe url="" />
    <CheckBox />
    <Button>Agree</Button>
</Dialog>
{% endcodeblock %}

# 將 PDF url 傳入 iframe
PDF 上傳到 server 獲得網址後塞進 iframe。
{% codeblock lang:javascript %}
<Dialog>
    <iframe title="contract update" url={pdfURL} />
    <CheckBox />
    <Button>Agree</Button>
</Dialog>
{% endcodeblock %}

呈現的畫面會如下，超簡單吧！
![mawchu blog - iframe pdf reader](/images/iframe-pdf-reader-0.jpg)