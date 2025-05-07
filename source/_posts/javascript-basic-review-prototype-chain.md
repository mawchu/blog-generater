---
title: 回顧 JavaScript 核心 X Basic Review - Prototype Chain
date: 2025-05-06 15:16:20
categories: Frontend Interview
tags:
- JavaScript
- Prototype Chain
- Execution context
- OOP
- Encapsulation
- Inheritance
- Polymorphism
---

{% include_md %}
本篇複習關於 JavaScript 實作 OOP 的背後真相：**Prototype Chain 原型鏈**。
<!-- more -->

# OOP 物件導向

物件導向在不同程式語言中的落實原理不同，但都是為了進行模塊(module)、實例化、原生型別的 OOP 概念建構，
**封裝(Encapsulation)**、**繼承(Inheritance)**、**多型(Polymorphism)** 等行爲，就是 OOP 最常見的幾個操作方式。

| OOP 核心概念         | JavaScript 實作方式                    | 範例 / 解釋 |
|----------------------|----------------------------------------|-------------|
| **封裝** (Encapsulation) | 物件、`function`、`class` 內的屬性與方法 | 把狀態和行為包在一個作用域內 |
| **繼承** (Inheritance)   | `prototype chain`、`extends`、`Object.create()` | 子類繼承父類的方法與屬性 |
| **多型** (Polymorphism) | 方法覆寫（override）與相同介面不同實作 | 同一方法不同行為 |

## 封裝（Encapsulation）

定義：把「狀態（資料）」和「行為（方法）」打包成一個單位，保護內部實作細節。
JavaScript 用 **object**、**class** 或 **closure** 隔離內部狀態。

### 公有屬性 Public properties
`greet()` 方法實際是掛在 `Person.prototype` 上（共用記憶體），但沒限制：任何人都能改

```js
// Public properties
class Person {
  constructor(name) {
    this.name = name; // 封裝屬性
  }

  greet() {
    console.log(`Hello, I'm ${this.name}`);
  }
}

const p = new Person('毛球');
p.greet(); // Hello, I'm 毛球

p.name = '別人'

p.greet(); // Hello, I'm 別人 <- this.name 不是私有

p.greet = function () {
  console.log(`Hello, I'm 改過的 ${this.name}`)
}

p.greet(); // "Hello, I'm 改過的 別人" <- this.greet() 不是私有
```
### 私有屬性 Private properties
#### 方法一：使用 closure 模擬私有變數

```js
function createCounter() {
  let count = 0; // 私有變數，外部看不到

  return {
    increment() {
      count++;
      console.log(count);
    }
  };
}

const counter = createCounter();
counter.increment(); // 1
counter.increment(); // 2

counter.increment = function () {
  console.log(counter.count); // undefined
  console.log(counter.count); // undefined
  console.log(this.count); // undefined
  counter.count--; // NaN
}

counter.increment();
```

#### 方法二：ES2022 支援 # 私有欄位

[MDN文章 - Private properties](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_properties)

```js
// # hash Private properties
class Person {
  #name;
  constructor(name) {
    this.#name = name;
  }

  greet() {
    console.log(`Hi, I'm ${this.#name}`);
  }
}

const p = new Person('毛球');
p.greet();           // ✅ Hi, I'm 毛球
console.log(p.#name); // ❌ SyntaxError: Private field '#name' must be declared in an enclosing class
```
這就是語法上正式支援的「真正私有欄位」。

## 繼承（Inheritance）
定義：子類別可以「承襲」父類別的屬性與方法，重用既有邏輯。

Javascript 使用 `prototype chain`、 `class extends` 或 `Object.create()`實作繼承。
Dog 類別從 Animal 繼承所有方法，包含 `speak()`，如果沒寫 Dog 的 `speak()`，那 `dog.speak()` 就會去呼叫 `Animal.prototype.speak()`。

```js
class Dog extends Animal {}

const dog = new Dog();
dog.speak(); // Animal makes sound（繼承的行為）

```


Dog 定義了同名的 speak() 方法，這會覆蓋掉繼承自 Animal 的那個版本。
所以 你是繼承了方法，但選擇覆蓋它（override）來自訂行為。

```js
class Animal {
  speak() {
    console.log('Animal makes sound'); // ← 父類別原本的方法
  }
}

class Dog extends Animal {
  speak() {
    console.log('Dog barks'); // ← 覆蓋掉父類別的 speak
  }
}

const dog = new Dog();
dog.speak(); // 👉 Dog barks
```

底層使用 Prototype 的底層原理：

```js
function Animal() {}
Animal.prototype.speak = function () {
  console.log('Animal makes sound');
};

function Dog() {}
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;
Dog.prototype.speak = function () {
  console.log('Dog barks');
};
```

## 多型（Polymorphism）

定義：不同物件可以使用「相同的方法名稱」，但表現出不同的行為。

### 覆寫（Overriding）

覆蓋繼承邏輯，讓子類有自己的版本。
你只呼叫 `speak()`，但執行的是各自定義的版本。

```js
const animals = [
  new Dog(),
  new Animal()
];

animals.forEach(a => a.speak());
// Dog barks
// Animal makes sound
```

你只呼叫 speak()，但執行的是各自定義的版本。

### 多載（Overloading）

定義：同一個方法名稱，不同參數數量或型別，有不同實作。

#### Java

這是 Java/C++ 的語法糖：

```js
class Math {
  int add(int a, int b) {...}
  double add(double a, double b) {...}
}
```
解釋一下 Java「靜態型別語言」中的資料型別（data types）：

| 型別       | 中文意思   | 用來存什麼                  |
| -------- | ------ | ---------------------- |
| `int`    | 整數型別   | 存像 1、2、100、-50 這種整數    |
| `double` | 雙精度浮點數 | 存像 3.14、0.01、-2.5 這種小數 |


#### Javascript

跟 Java 不同，JS 做不到直接多載，但你可以靠「判斷參數」來模擬：

```js
function greet(name, age) {
  if (age !== undefined) {
    console.log(`Hi ${name}, you're ${age}`);
  } else {
    console.log(`Hi ${name}`);
  }
}
```
#### TypeScript

TypeScript 可以「看起來」像 Overloading（但本質還是判斷）
```ts
function greet(name: string): void;
function greet(name: string, age: number): void;
function greet(name: string, age?: number) {
  if (age) console.log(`${name}, ${age}`);
  else console.log(`${name}`);
}
```



# Javascript 的原型鏈是一切基礎

JavaScript 是基於原型繼承（prototype-based inheritance） 的語言。
也就是說，物件可以從另一個物件繼承屬性與方法，而這個繼承機制就是透過「原型鍊」實現的。

## 原始型別包裹器(Primitive Wrapper)

原始型別有幾個：**Boolean**、**Null**、**Undefined**、**BigInt**、**String**、**Symbol** 幾種，但他們都不是物件卻可以做以下操作：

```js
// String() 包裹器
const str = "hello";
str.toUpperCase(); // JS 背後幫你做了：

// 等同於：
new String("hello").toUpperCase();

```

### 原始型別包裹器與原型鏈的關係

JS 中「萬物皆物件」，但方法都藏在 prototype 裡。
當你對 Primitive Type（原始型別）使用 . 符號時，JavaScript 會在背後偷偷幫你做一件事：

```js
// JS 會幫你自動這樣做
const str = new String("hello"); // 建立一個 String 物件
str.__proto__ === String.prototype; // ✅ true

```

如此一來就能使用繼承鏈上的所有型別方法囉！

### 幾乎萬物皆物件，除了 null 和 undefined

以下是 JavaScript 中常見內建型別的原型鏈整理成表格，包含實例的 `__proto__`、建構函式的 `.prototype` 與其父原型關係：

| 值的類型 (實例)        | `__proto__`（實例）      | `.prototype.__proto__`（父原型） | 備註        |
| ---------------- | -------------------- | --------------------------- | --------- |
| `'abc'`          | `String.prototype`   | `Object.prototype`          | 字串實例      |
| `123`            | `Number.prototype`   | `Object.prototype`          | 數字實例      |
| `true`           | `Boolean.prototype`  | `Object.prototype`          | 布林實例      |
| `Symbol('a')`    | `Symbol.prototype`   | `Object.prototype`          | Symbol 實例 |
| `123n` (BigInt)  | `BigInt.prototype`   | `Object.prototype`          | BigInt 實例 |
| `[]`             | `Array.prototype`    | `Object.prototype`          | 陣列實例      |
| `function() {}`  | `Function.prototype` | `Object.prototype`          | 一般函式      |
| `() => {}`       | `Function.prototype` | `Object.prototype`          | 箭頭函式      |
| `{}`             | `Object.prototype`   | `null`                      | 最底層       |
| `new Date()`     | `Date.prototype`     | `Object.prototype`          | 日期物件      |
| `/abc/` (RegExp) | `RegExp.prototype`   | `Object.prototype`          | 正規表達式     |
| `new Error()`    | `Error.prototype`    | `Object.prototype`          | 錯誤物件      |
| `new Map()`      | `Map.prototype`      | `Object.prototype`          | ES6 Map   |
| `new Set()`      | `Set.prototype`      | `Object.prototype`          | ES6 Set   |
| `new WeakMap()`  | `WeakMap.prototype`  | `Object.prototype`          | WeakMap   |
| `new WeakSet()`  | `WeakSet.prototype`  | `Object.prototype`          | WeakSet   |

#### 函式與建構函式本身的原型鏈

| 建構函式       | 自身的 `__proto__`      | `.prototype.__proto__` | 備註                |
| ---------- | -------------------- | ---------------------- | ----------------- |
| `String`   | `Function.prototype` | `Object.prototype`     | 是函式               |
| `Number`   | `Function.prototype` | `Object.prototype`     | 同上                |
| `Boolean`  | `Function.prototype` | `Object.prototype`     | 同上                |
| `Array`    | `Function.prototype` | `Object.prototype`     | 同上                |
| `Function` | `Function.prototype` | `Object.prototype`     | 特殊情況（自己生自己）       |
| `Object`   | `Function.prototype` | `null`                 | `.prototype` 為最底層 |
| `Date`     | `Function.prototype` | `Object.prototype`     | 同上                |
| `RegExp`   | `Function.prototype` | `Object.prototype`     | 同上                |

#### Object.prototype.__proto__ === null

Object.prototype 是所有物件原型鏈的終點。

```js
{}                <-- 一般物件實例
 └── __proto__ → Object.prototype
                     └── __proto__ → null (原型鏈終點)

```

#### 
- `null` 本身就是 prototype 鏈的終點，沒東西可繼承。
- `undefined` 是完全獨立的原始值，也沒有原型鏈。

```js
null.__proto__        // ❌ TypeError
undefined.__proto__   // ❌ TypeError
```

打完收工！