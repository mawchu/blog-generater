---
title: Google Tag Manager - 你的 datalayer 設定小幫手
date: 2024-08-28 09:31:10
tags:
- Google Tag Manager
- Data Layer
---

{% include_md %}
各行各業針對品牌特性的客群行為追蹤會因應產業的商務模式變換目標，例如物聯網、電子商務、投資等不同用戶在採取的使用者流程上會有細微差異需要綁定的追蹤事件需要客製化設定，以便利行銷或者公司高管採取對應措施或方針的改變，**Google Tag Manager** 就是一個集合多種追蹤技術的行為分析平台，先前有在[Google Tag Manager 起手式](https://maomaoxie.github.io/2022/10/05/google-tag-manager-start-up/)粗略地介紹過。
<!-- more -->

# 埋設追蹤事件
Google 埋設事件並且追蹤可以使用兩大方式：
1. 適合行銷人：使用 **Google Tag Manager** 平台設定觸發條件或變數制定觸發時機。
2. 適合工程師：在專案中添加 **DataLayer** 來制定事件名稱（event）與行為（action）。

## Google Tag Manager 追蹤事件流程
透過 `dataLayer` 的操作可以搭建與 GTM 的溝通橋樑，將資料推送到 GA 與 facebook pixels 等流量監控的平台。
<img style='margin-right: unset; margin-left: unset; padding-top: 30px' src='/blog/images/google-tag-manager-and-datalayer-0.jpg' alt="https://www.maxlist.xyz/2023/06/01/gtm-datalayer/" width='min(100%, 600px)' height='auto'>


## Google Tag Manager
制定 Tags 也就是觸發事件的 UI 平台，還有提供版本發布的控制，網頁載入時會執行以下內容：
```js
window.dataLayer.push(
    {
        'gtm.start': new Date().getTime(),
        'event': 'gtm.js'
    }
)
```
> 當使用者載入網站頁面時，GTM 會推送 {event: "gtm.js", ...} 到 dataLayer，然後檢查我們有沒有針對「網頁瀏覽 (gtm.js)」觸發條件做設定，如果有的話，則觸發我們設定好的代碼。
> -- [【GTM 追蹤學】什麼是 dataLayer? 最詳細解說](https://www.maxlist.xyz/2023/06/01/gtm-datalayer/)

## DataLayer
制定的方式在 window 宣告一個 dataLayer 變數陣列提供 Google Tag Manager 掌握事件與鎖定追蹤行為。
```js
function addDataLayer(event, action) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: event,
    event_action: action,
  });
};
```
### 填問券
基本的使用方式：
```js
async questionnaireResponse(type) {
    this.showQuestionnaireValidate = (await apiGetQuestionnaire()).data.data
    // this.showQuestionnaire = true;
    addDataLayer('questionnaire', 'button');
},
```
根據 API 回應調整追蹤：
```js
apiCheck({ answers: Object.values(this.answers) })
    .then(resp => {
        if(resp.data) {
            addDataLayer('questionnaire', `success`); // tracking
        } else {
            addDataLayer('questionnaire', `fail`); // tracking
        }
    });
```

# 延伸閱讀
在舊的部落格有略為接觸過幾次 **Google Tag Manager** 的相關設定工作，感興趣可以涉略：

## Datalayer 相關
[如何在 wordpress 埋入 GA code](https://maomaoxie.github.io/2022/09/15/zh-tw/wordpress-ga-track/)

## Google Tag Manager 相關
[Google Tag Manager 起手式](https://maomaoxie.github.io/2022/10/05/google-tag-manager-start-up/)

## Google Analytics
[關於 Google Analytics GA 你應該知道的事](https://maomaoxie.github.io/2022/10/09/google-analytics-knowhow/)