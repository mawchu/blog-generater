---
title: 保存畫布 createImageBitmap X visibilitychange
date: 2024-05-20 14:30:10
tags:
---

{% include_md %}
在工作上遭遇到 canvas 繪製的獎品轉盤(Spin Wheel)在**切換視窗後再回來 canvas 遺失的問題**，由於轉盤是前人開發的又剛好在自測時發現 issue，就抱持著試試看的心態來查[解決方法](https://stackoverflow.com/questions/71201403/html-canvas-disappears-in-chrome-after-browser-window-tab-becomes-inactive)。
<!-- more -->

意外的查到兩個從未碰過的技術：canvas API `createImageBitmap()`global function 用來保存 Canvas (或其他圖像技術)資源在 windows 與 workers 生命週期中，另一個是監聽視窗標籤(Tabs) 甚麼時候切換為可見的事件 `onvisibilitychange` event。

不過該問題似乎只存在於開發者模式下，少部分的使用者才會遇到。
> Given that this is all behind dev flags, few of your users should face it, and it's probably not worth the effort to implement a workaround for it.
But if you really need one, you can create an ImageBitmap in the visibilitychange event and do the restore yourself:

# createImageBitmap function
該方法並存於 Windows 以及 Workers，接收資源作為參數後創建一個圖像位元地圖(ImageBitmap)，會裁減一部分的資源存取起來，接收多種圖像資源並且 **回傳一個 Promise** 乘載著 `ImageBitmap` 可以繪製到 canvas 上面。
> The createImageBitmap() method creates a bitmap from a given source, optionally cropped to contain only a portion of that source. The method exists on the global scope in both windows and workers. It accepts a variety of different image sources, and returns a Promise which resolves to an ImageBitmap.

# onvisibilitychange event
事件監聽器的一種，觸發時機為當下子視窗(Tabs) 切換可視時，SPA 框架下應記得適時的移除監聽器。

# example code
[範例來源](https://stackoverflow.com/questions/71201403/html-canvas-disappears-in-chrome-after-browser-window-tab-becomes-inactive)

{% codeblock lang:javascript %}
  const canvas = document.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "red";
  ctx.fillRect(0, 0, 40, 40);
  let bmp;
  document.onvisibilitychange = async(evt) => {
    if (document.visibilityState === "hidden") {
      bmp = await createImageBitmap(canvas);
    } else {
      ctx.globalCompositeOperation = "copy";
      ctx.drawImage(bmp, 0, 0);
      ctx.globalCompositeOperation = "source-over";
    }
  };
{% endcodeblock %}