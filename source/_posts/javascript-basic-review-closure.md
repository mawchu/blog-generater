---
title: 回顧 JavaScript 核心 X Bsic Review - Closure
date: 2025-04-29 10:19:17
categories: Frontend Interview
tags:
- JavaScript
- Closure
- 
---

{% include_md %}

本篇複習關於 JavaScript 最基礎的知識點：**Closure**。
<!-- more -->

# 閉包的定義

一個子函式可以記住且持續存取外部作用域的變數，即便脫離父層函式的執行環境仍可在外部取用或執行。
閉包的特色包含：

- 子函式(Inner Function)
- 外部變數(Outer Variables)
- 定義當下的作用域(Lexical Environment)，每次呼叫會創造一個新的作用域
- 垃圾回收機制(GC)

很重要的一點在「保護私有變數不為外部修改或取用」!

```js
function outer() {
  let message = 'Hello';

  function inner() {
    console.log(message);  // 用到了外層的變數
  }

  return inner;
}

const myFunc = outer();
myFunc();  // => "Hello"
```

## 應用的實際範例

曾需要在專案內根據「投資年限」的長短計算手續費率，得出投資長達 1~該投資年(investYear) 的費率變化：

```js
 function generateFeeRate () {
    let fee = 1; // 預設費率
    return (investYears: number) => {
        // 投資奇數年並大於兩年
      if ((investYears % 2 === 1) && (investYears > 2)) {
        // 若費率大於 0.6 每兩年再降 0.1
        // 費率最低至 0.5
        fee = fee > 0.6 ? fee - (0.1 * (investYears % 2)) : 0.5;
      }
      return Number(fee.toFixed(2));
    };
  }
```

再根據客戶的投資年限 + 投資本金去計算出費用圖表：

```js
 function reCalculateAssetData () {
    const fee = this.generateFeeRate();
    for (let n = 0; n <= this.investYears; n++) {
      this.generateAssetData(fee(n), n, this.sliderA, this.sliderB, this.sumArr);
    }
  }

  @Watch('investYears')
  @Watch('sliderA')// 投資方式 A
  @Watch('sliderB')// 投資方式 B
  function regenerateChart () {
    this.reCalculateAssetData();
    this.drawLineChart(...);
  }
```

封裝費率的值，來得出不同投資年分的資產總值計算費用：

```js
const fee = this.generateFeeRate(); // 初始化
fee(1); // 呼叫 closure 得到第 1 年費率
fee(2); // 呼叫 closure 得到第 2 年費率
```

## 實戰框架的應用

在 Vue React 的應用可謂遍地開花：
| 案例類型 | 案例範例 | 說明 |
|:---|:---|:---|
| **事件監聽器** (Event Handlers) | `onClick={() => handleClick(item.id)}` | 這個 `item.id` 是靠 closure 記住的！ |
| **Hooks (React)** | `useState`, `useEffect`, 自訂 hooks | `useEffect` 裡的回呼函式會「記住」當下的變數狀態。 |
| **Composition API (Vue3)** | `setup` 裡 return 出來的函式 | `setup()` 裡定義的變數，被 `ref` 或方法捕捉到。 |
| **工廠函式** (例如 debounce、throttle) | `useDebounce(fn, delay)` | debounce 內部會記住 timer id。 |
| **表單驗證器生成** | 比如 `createValidator()` 回傳自訂驗證函式 | Validator 會 closure 捕捉驗證條件。 |
| **回傳 function 的設計** | service, composable, helper | 一個函式 return 出另一個帶著設定的函式。 |

### React

每個元件本身都是一個父層作用域，內部定義的 handler methods 都可以提取定義在父層作用域的變數：

```js
function Counter() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    console.log(count); // ⚡ 這裡 closure 捕捉到的是「定義時的 count」
    setCount(count + 1);
  };

  useEffect(() => {
    const timer = setInterval(handleClick, 1000);
    return () => clearInterval(timer);
  }, []); // 注意這裡空陣列！

  return <div>{count}</div>;
}
```

### Vue3 Setup

`<script setup>` 標籤是一個封裝的 `Setup(){}` 函式，本身是一個父層作用域，所以內部定義的 handler methods 都可以提取定義在父層作用域的變數：

```vue
<script setup>
const data = ...;  // 父層 setup 函式裡的資料

function handler() {
  // 每次呼叫 handler，也從 closure 拿 data
}
</script>
```

### Vue2 This

Vue2 的變數資料是透過 `Object.defineProperty`  實作 Proxy-like 對每個屬性建立 getter/setter，註冊在 data 物件後透過代理在 `this` 上面的行為來取得資料。

```js
// 定義資料物件
data() {
  return { count: 0 }
}

// 背後原理 1:包裝成響應式
function defineReactive(obj, key, val) {
  const dep = new Dep(); // 👈 這是 Vue 裡專門負責通知更新的「訂閱器」

  Object.defineProperty(obj, key, {
    get() {
      // 👁️ 依賴收集：誰用到我，就記下來（像 watcher）
      dep.depend();
      return val;
    },
    set(newVal) {
      if (newVal !== val) {
        val = newVal;
        // 🔔 通知所有依賴我的人：「嘿，我變了喔！」
        dep.notify();
      }
    }
  });
}
defineReactive(obj, key, val) 

// 背後原理 2: 代理到 this
Object.defineProperty(this, 'count', {
  get() { return this._data.count; },
  set(v) { this._data.count = v; }
});
```
所以 Vue2 資料註冊的方式不是透過 Closure，而是透過訂閱更新的 `this` 獲取最新資料！

## 工廠函式與閉包
先定義了一個具有閉包的函式後，透過「呼叫函式保留了該作用域並封存變數」，以產生一個或多個保有各自私有狀態的工廠函式；換句話說，工廠函式需要透過閉包的手法建立。

```js
function createCounter() {
  let count = 0; // 👈 這是被閉住的私有變數
  return {
    increment() {
      count++;
      return count;
    },
    reset() {
      count = 0;
    }
  };
}

const counter1 = createCounter();
console.log(counter1.increment()); // 1
console.log(counter1.increment()); // 2
```

## 三方套件與 IIFE 閉包

IIFE（Immediately Invoked Function Expression）之所以常被用來定義私有變數，正是因為閉包的特性。
是在 ES6 模組 (import/export) 出現前，常見的私有變數封裝技巧。

例如封裝模組：

```js
const Counter = (function () {
  let count = 0; // 👈 私有變數，外面碰不到！

  return {
    increment() {
      count++;
      console.log(count);
    },
    reset() {
      count = 0;
    }
  };
})();
```

# 來幾個老朋友閉包陷阱題

## For loop 系列

### 經典 for 迴圈 + setTimeout 問題

for loop 可以看做一個 **外部執行環境**，內部的 setTimeout `callback` 自然形成一個閉包子函式：

```js
for (var i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i);
  }, 100);
}
```

答案預期輸出什麼？

```js
3
3
3
```
為什麼？

- `var` 是 **function-scope**，每一圈跑完都會汙染 `i` 的值，最後 `i = 3` (包含迴圈最後執行 i++)
- `setTimeout` 是宏任務會最後執行。

#### 解法 1 - let

```js
for (let i = 0; i < 3; i++) {
  setTimeout(() => { // 閉包產生
    console.log(i);
  }, 100);
}
```
答案預期輸出什麼？

```js
0
1
2
```
- `var` 改成 `let` 會套用 **block-scope** 屬性，就可以讓每一次的迴圈重新建立自己的 `lexical scope`。

#### 解法 2 - IIFE

```js
for (var i = 0; i < 3; i++) {
  (function(j) {
    setTimeout(() => { // 閉包產生
      console.log(j);
    }, 100);
  })(i);
}
```
立即呼叫函式的閉包特性始得私有變數 `i` 在每一次呼叫時立刻封裝起來，讓子函式使用獨立的 `j`，所以可以完美的更新正確的變數。

# 閉包的廣義

所有函式本質上都可能是閉包，因為它們都帶有「定義當下的作用域鏈」(Lexical Scope Chain)。
只是真正重要的閉包行為，是當函式「離開原本的作用域」，仍然「記得當初的變數」。

