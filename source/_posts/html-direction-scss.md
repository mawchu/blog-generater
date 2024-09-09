---
title: HTML 文本元素 dir - text directionality
date: 2024-09-09 14:42:27
categories: SCSS
tags:
- HTML
- dir
- SCSS
---

{% include_md %}
接觸過 i18n 多國語言的同學一定對書寫方向（Directionality of elements text）並不陌生，算是前端一個滿運氣運氣會碰到的工作，可以當個冷知識來學習一下！
<!-- more -->

<img class="post-image" style='margin-right: unset; margin-left: unset; padding-top: 30px' src='https://images.pexels.com/photos/17635098/pexels-photo-17635098/free-photo-of-door.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' width='80%' height='auto'>

# RTL 的語言設定
例如阿拉伯（Arabic, 縮寫 ar）、波斯（Farsi, 縮寫 fa）等就是屬於 **RTL（Right to left）** 由右至左的書寫方向，窺探一下語言設定的檔案可知一二：

```js
export const RTL_LANGUAGE_LIST = ['ar', 'fa'];
```

```js
import { RTL_LANGUAGE_LIST } from '@/constants/language.js'

export default {
    data() {
        return {
            ...
        }
    }
    watch: {
        lang: {
        immediate: true,
        handler(val) {
            setLocale(val);
                ...
                document.body.dir = RTL_LANGUAGE_LIST.includes(val) ? 'rtl' : 'ltr'
            },
        },
    }
```

產出的 HTML 就可以輕鬆制定書寫方向的樣式了：
```html
<body dir="rtl">...</body>
<body dir="ltr">...</body>
```


透過 HTML attribute `dir="rtl" ` 設定由右至左， `dir="ltr" ` 設定由左至右的書寫方向以外，還可以結合 SCSS 的 `@include` 來自定義分別左與右的樣式避免破版。

# SCSS 函式制定書寫方向樣式
專案上有使用幾個類型的延伸寫法，分別因應不同使用場景：

## 共用 Property
適用一種 property 但不同值，例如文字對齊方向：

```scss
// 撰寫
@mixin directionality-diff-value($property, $ltr-value, $rtl-value) {
  [dir='ltr'] & {
    #{$property}: $ltr-value;
  }

  [dir='rtl'] & {
    #{$property}: $rtl-value;
  }
}

//應用
.ql-editor {
    @include directionality-diff-value(text-align, left, right);
}
```

## 共用 Value
適用兩種 property 但同值，例如浮動位置、內外距：

```scss
// 撰寫
@mixin directionality-diff-property($ltr-property, $rtl-property, $value) {
  [dir='ltr'] & {
    #{$ltr-property}: $value;
  }

  [dir='rtl'] & {
    #{$rtl-property}: $value;
  }
}

//應用
.btn_group {
    .second_btn{
      @include directionality-diff-property(margin-left, margin-right, 0);
    }
  }
```

## 各自為政
適用 Property 與 Value 各有不同時，例如靠左或靠右且位置有異：

```scss
// 撰寫
@mixin directionality-dual($ltr-property, $ltr-value, $rtl-property, $rtl-value) {
  [dir='ltr'] & {
    #{$ltr-property}: $ltr-value;
  }

  [dir='rtl'] & {
    #{$rtl-property}: $rtl-value;
  }
}

//應用
.login_dropdown_box {
    .popper__arrow {
        @include directionality-dual(right, 0px !important, left, 10px !important);
    }
}
```

## 單邊設定
適用由右至左書寫方向需要手動制定時，由於大眾書寫方向為 LTR 通常不用特別設定時就需 **針對 RTL** 撰寫樣式：

```scss
// 撰寫
@mixin directionality-single($rtl-property, $rtl-value) {
  [dir='rtl'] & {
    #{$rtl-property}: $rtl-value;
  }
}

//應用
.el-input__inner {
    @include directionality-single(flex-direction, row-reverse); // 反轉方向
    @include directionality-single(text-align, right); // 預設 left
}

```

# 國際語言代碼表
以下補充語言代碼的對應縮寫或者別名：
|  縮寫  |          語言     |      書寫方向     |
|:-------:|:---------------:|:--------------------:|
|   en   |   English        |    LTR    |
| zh-CN  |   簡體中文    |    LTR     |
| zh-TW  |   繁體中文    |    LTR     |
|   ar   |   Arabic         |    **RTL**     |
|   de   |   German         |    LTR     |
|   es   |   Spanish(EU)    |    LTR     |
|   fa   |   Farsi, Persian 波斯語   |     **RTL** |
|   fr   |   French          |    LTR   |
|   hi   |   Hindi 印度文、印地語      |    LTR   |
|   id   |   Indonesian      |    LTR   |
|   it   |   Italian      |    LTR   |
|   ja   |   Japanese      |    LTR   |
|   km   |   Khmer 高棉語、柬埔寨      |    LTR   |
|   kr   |   Korean      |    LTR   |
|   mn   |   Mongolian 蒙古語     |    LTR   |
|   my   |   Bahasa Malaysian     |    LTR   |
|   nl   |   Netherland, Dutch 荷蘭、尼德蘭語     |    LTR   |
|   pl   |   Polish 波蘭語     |    LTR   |
|   pt   |   Portuguese(EU) 葡萄牙語    |    LTR   |
|   ru   |   Russian 俄羅斯    |    LTR   |
|   th   |   Thai 泰語    |    LTR   |
|   tl   |   Filipino, Tagalog 菲律賓、塔加路語   |    LTR   |
|   vi   |   Vietnamese 越南語   |    LTR   |