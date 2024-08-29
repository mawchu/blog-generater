---
title: HTTP error handler 錯誤控制
date: 2024-06-20 11:41:06
categories: HTTP
tags:
- HTTP
- error handler
- axios
- fetch
---

{% include_md %}

Axois 與 Fetch 兩大 Library 會給予客製化錯誤控制與處理流程，根據返回的 `Promise` 會按照 HTTP **response status** 情況歸納至 `then()` 以及 `catch()`：
<!-- more -->

# response status code
公定的錯誤訊息可以當作初步判定大方向的依據，健康的一次前後端交流應當能透過此方式排查錯誤。
在之前的就網站上 [這篇文章](https://maomaoxie.github.io/2022/03/01/zh-tw/http-status-code/)有詳細描述 code 的幾個大致情況，重新複習一下：

| Status   | Type                             | Description                                                                 |
| -------- | -------------------------------- | --------------------------------------------------------------------------  |
| 1XX      | Informational response           | 代表要求已接受並了解了，因某些問題要求仍在繼續但尚未回應需要等候一陣時間。         |
| 2XX      | Successful response              | 通常代表成功情況，request & response 完成了一次資料的交流。                     |
| 3XX      | Redirection messages             | 網站可能遭遇重新導向的問題。                                                   |
| 4XX      | Client error responses           | 通常代表著 request 方面的缺失或者錯誤，權限不足或者 input 不正確導致不回應。      |
| 5XX      | Client error responses           | 伺服器端的問題導致回應失敗。                                                   |


# server customized error code
與後端協調制定的客製化錯誤訊息。由於公定的 HTTP status code 並不足夠闡述各種業務端口的 issue，所以各家公司的服務需要透過 `response.data.messages` 或者 `response.data.code` 來描述實際的錯誤內容以利於工程師互相溝通或者提供業務與客戶理解。

# Handling Response Error Library
以下介紹兩大錯誤處理套件 AXIOS 與 FETCH 在邏輯上的些微差異：
|          | Fetch                                           | Axios                         |
| -------- | ----------------------------------------------- | ----------------------------  |
| note     | 需要客製化設定錯誤情況，制定錯誤事件               | 套件經過包裝簡化了判斷          |
| then     | response.ok or customized successful condition  | HTTP status 200-299           |
| catch    | throw new Error() triggers error                | outside HTTP status 200-299   |

## Fetch 的成功判斷
## response.ok 
當 HTTP status 在範圍 200-299 內時 response.ok 為 `true`，示例如下：

{% codeblock lang:javascript %}
fetch('https://api.example.com/data')
  .then(response => {
    // Check if the HTTP status code is not in the range 200-299
    if (!response.ok) {
      // Throw an error to be caught in the .catch() block
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    // If response is OK, parse it as JSON
    return response.json();
  })
  .then(data => {
    // Handle the JSON data
    console.log('Data:', data);
  })
  .catch(error => {
    // Handle errors: network issues or HTTP errors
    console.error('Fetch error:', error.message);
  });
{% endcodeblock %}

## Axios 的種類判斷
Axios 的錯誤控制範例：

{% codeblock lang:javascript %}
import axios from 'axios';

axios.get('https://api.example.com/data')
  .then(response => {
    // Handle the response data
    console.log('Data:', response.data);
  })
  .catch(error => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('HTTP error! Status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Network error:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message);
    }
  });
{% endcodeblock %}

### then
#### response.data
倘若要求成功回應會帶上 data，並且協帶一個 data 物件。

### catch
當要求失敗會提供的判斷訊息，依據錯誤的不同提供幾種錯誤：

#### error.response
當 HTTP status code 在 200-299 以外時，可以透過 `error.response.status` 查詢錯誤代碼以及 `error.reponse.data` 取得伺服器回應的錯誤內容。

#### error.request
要求成功但沒有回應。

#### error.messages
要求設定發生問題導致錯誤。