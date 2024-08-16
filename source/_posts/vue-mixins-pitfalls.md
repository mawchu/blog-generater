---
title: 你不知道的 Vue Mixins Pitfalls 小陷阱
date: 2024-06-25 09:22:49
tags:
- vue2
- vue mixins
- objects merge
- mixins pitfalls
---

{% include_md %}
<!-- more -->

在工作上第一次接觸到專案開發使用 **Vue mixins** 到有點氾濫的情況（甚至追朔至2-3個 mixins），所以採到的一個奇妙的雷。
前述一下遭遇的業務邏輯場景：
1. 頁面中存在父子組件同時需要應用一組 Mixins，共有一個 data **token**。
2. 由父組件來控制呼叫 API 改變臨時 token 以防用戶誤觸或者有心人士連擊。
3. 子組件則拿更新後的 token 來執行出入金。



# mixins
先定義了一個 mixins 提供組件使用。
```js
import { tokenApi } from '@/api'
export default {
    data() {
        return {
            token: '',
        }
    },
    mounted() {
        this.getToken()
    },
    methods: {
        getToken() {
            return new Promise((resolve, reject) => {
                tokenApi()
                    .then(resp => {
                        if (resp.data.code == 0) {
                        this.token = resp.data.data
                            resolve();
                        } else {
                            reject();
                        }
                    })
                    .catch(err => {
                        reject();
                    })
            })
        },

    },
}


```
# Parent component
父組件控制更新 Token 的時機點。
```js
...
<template>
    <component
        ref="child"
        :is="currentComponent"
        @submitChild="submitChild"
    ></component>
</template>
<script>
    import mixin from '@/mixins';
    export default {
        name: 'parent',
        mixins: [mixins],
        data () {
            ...
        }
        methods: {
            submitParent() {
                this.$refs.child.submitChild() // ------------ 呼叫子組件本身的 channel API
                    .then(resp => {
                        if (resp.data.code === 0) {
                            ...
                        } else {
                            ...
                            this.getToken() // --------------- 雷點，後面詳述
                                .then(resp => {
                                    this.loading = false;
                                })
                                .catch(resp => {
                                    this.loading = false;
                                })
                        }
                    })
            }
        }
    }
</script>
```

# Child component
子組件因應各自的出入金渠道而需要呼叫不同 API。
```js
<template>
    ...
    <el-button
        :loading="loading"
        :disabled="loading"
        @click="submitChild"
    >
        submit
    </el-button>
</template>
<script>
    import { childChannelApi } from '@/channels';
    export default {
        name: 'child',
        mixins: [mixins],
        data () {
            ...
        }
        methods: {
            submitChild() {
                return childChannelApi(
                    {
                        account: '*****',
                        amount: '1234',
                        ...
                    },
                    this.token　// ------ token 被父組件更新後由渠道 API 使用
                )
            }
        }
    }
</script>

```

# 元件結構示意圖
![vue-mixins-components-structure](/images/vue-mixins-pitfalls.jpg)

## Merged into component's own data
> Data and methods defined in a mixin are merged into the component's own data and methods.

## 參考合併
> Each instance of a component using the mixin gets its **own independent copy of the data properties** defined in the mixin. This means that the top-level properties are **not shared between instances**, but **nested objects and arrays can still share references** if not handled properly.

文件與 ChatGpt 有提到**合併物件**的概念，這裡要注意的是一旦合併到元件所屬的 data 便意味著參考脫鉤了，無法再元件之間共享同一個位址而是各自為政的狀態，與 Vuex state 不是一個概念，僅能透過 `this.$refs.child` 的方式取得子元件本身的 scope data，並不符合當前業務邏輯「更新共享 Token」以及「同步共享 Token」的要求了。

### 問題描述
原先在父組件無論更新幾百次 this.token 都只是更新父祖件本身的 this.token 參考內的值，當子組件呼叫 API 送出的 this.token 永遠不會變化，因為該 token 隸屬於子組件本身的 data，根本是兩個獨立的記憶體位址互相無關。
> The token property is a primitive (string). Each component instance (parent and child) gets its own copy of token.

而上述提到的物件與陣列在此情況很可能會共享參考，剛巧不再這次的字串型別（Primative）資料 Issue 中，否則會更難釐清資料來源了。

如此一來父組件的程式需要更改為：

### Parent component
```js
...
<template>
    ...
</template>
<script>
    import mixin from '@/mixins';
    export default {
        name: 'parent',
        mixins: [mixins],
        data () {
            ...
        }
        methods: {
            submitParent() {
                this.$refs.child.submitChild()
                    .then(resp => {
                        if (resp.data.code === 0) {
                            ...
                        } else {
                            ...
                            // ------------- 直接呼叫子組件作用域內的 getToken 更新子組件本身的 token
                            this.$refs.child.getToken()
                                .then(resp => {
                                    this.loading = false;
                                })
                                .catch(resp => {
                                    this.loading = false;
                                })
                        }
                    })
            }
        }
    }
</script>
```

# 事後反思
mixins 一開始的應用應該是給予各組件共用可以 **extends 出去** 的初始狀態，僅是提供「共享邏輯」或者是「共享資料結構」，若要同步更新或共用一份資料很可能比較適合使用 **Vuex** 或者 `LocalStorage`、`SessionStorage` 等方式，以確保物件參考沒有脫鉤，個人認為共享的 functions 或 methods 才比較是 mixins 開發的初衷吧！

有紮實的 Javascript 基礎確實較能抓出框架內的坑，但很多時候坑是開發人員程式設計不慎的後果，例如這次專案中濫用 mixins 就是一個例子，需要提醒自己注意開發的靈敏度與避坑意識 ヽ(・×・´)ゞ