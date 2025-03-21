---
title: React - useContext hook 使用說明
date: 2024-05-02 14:35:10
tags:
  - React
  - React hooks
  - useContext
  - provide & inject
  - class life cycle
categories:
  - React
---

{% include_md %}
關於 React 的 useContext 可以理解為使用「上下文」，延伸為跨元件的共享資料，在學習 Vuex 時也可以見到參數被命名 `context`。

<!-- more -->

# Prop drilling 資料瀑布

在前端工程領域有一個詞彙 **prop drilling** 資料瀑布（對我自己翻的）描述了多代巢狀、跨元件結構所衍生的資料傳遞問題，前端任何熱門框架都會想方設法解決這個燙手山芋，一旦資料龐大或者使用流程複雜很容易走入 UI 的多重宇宙，一層又一層層的傳下去，元件嵌套了好幾層或者跨多個兄弟元件的情況下如何將資料垂直傳遞、水平傳遞？

以下比較 Vue & React 解決 prop drilling 的工具：

## Vue provide & inject

Vue 的使用概念比較像匯出跟匯入，
在提供資料的元件使用 `provide()` 提供出去；在接收資料的元件使用 `inject` 注入。

```js
// App.vue
<template>
  <div>
    <ChildA />
    <ChildB />
  </div>
</template>

<script>
import ChildA from './ChildA.vue';
import ChildB from './ChildB.vue';

export default {
  components: {
    ChildA,
    ChildB
  },
  provide: {
    message: 'Hello from App!' // ------------ provide here
  }
};
</script>
```

```js
// ChildA.vue
<template>
  <div>
    <GrandChild />
  </div>
</template>

<script>
import GrandChild from './GrandChild.vue';

export default {
  components: {
    GrandChild
  }
};
</script>
```

```js
// ChildB.vue
<template>
  <div>
    <GrandChild />
  </div>
</template>

<script>
import GrandChild from './GrandChild.vue';

export default {
  components: {
    GrandChild
  }
};
</script>
```

```js
// GrandChild.vue
<template>
  <div>
    <p>{{ message }}</p>
  </div>
</template>

<script>
export default {
  inject: ['message'] // --------------- inject here
};
</script>
```

## React useContext

`useContext` 的作法是開啟一個魔法陣(createContext)，變成一個容器一般的存在，所有應用的資料注入後(CustomContext.Provider)在擺進需要應用的元件，有沒有發現關鍵字「Provider」？在該作用域(scope)內放入共享的資料素材後，元件內就可以召喚魔法(useContext)來取得資料了!

<img class="post-image" style='margin-right: unset; margin-left: unset; padding-top: 12px; width: min(100%, 960px)' src='/blog/images/react-useContext-1.jpg' height='auto'>

### 操作說明書

- **`createContext`** 創建一個 context 上下文。

  ```js
  // AppContext.js
  import React, { createContext } from 'react';

  const AppContext = createContext();

  export default AppContext;
  ```

- **`CustomContext.Provider`** 提供一個 Provider 容器，將需要共享資料的元件放入，注意這裡的 Provider 首字大寫。

  ```js
  // App.js
  import React from 'react';
  import ChildA from './ChildA';
  import ChildB from './ChildB';
  import AppContext from './AppContext';

  const App = () => {
    return (
      <AppContext.Provider value={{ message: 'Hello from App!' }}>
        <div>
          <ChildA />
          <ChildB />
        </div>
      </AppContext.Provider>
    );
  };

  export default App;
  ```

- **`useContext`** 提供接口讓元件承接注入的資料。

  ```js
  // ChildA.js
  import React from 'react';
  import GrandChild from './GrandChild';

  const ChildA = () => {
    return (
      <div>
        <GrandChild />
      </div>
    );
  };

  export default ChildA;
  ```

  ```js
  // ChildB.js
  import React from 'react';
  import GrandChild from './GrandChild';

  const ChildB = () => {
    return (
      <div>
        <GrandChild />
      </div>
    );
  };

  export default ChildB;
  ```

  ```js
  // GrandChild.js
  import React, { useContext } from 'react';
  import AppContext from './AppContext';

  const GrandChild = () => {
    const { message } = useContext(AppContext);

    return (
      <div>
        <p>{message}</p>
      </div>
    );
  };

  export default GrandChild;
  ```

<iframe height="300" style="width: 100%;" scrolling="no" title="React.useContext" src="https://codepen.io/mawchu/embed/XWQwvzz?default-tab=js%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/mawchu/pen/XWQwvzz">
  React.useContext</a> by Jamie Hsieh (<a href="https://codepen.io/mawchu">@mawchu</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

> 注意良好的撰寫習慣，context 命名首字大寫(Capitalize)！

# useContext 對渲染的影響

雖然 useContext 是跨元件之間除了 redux、zustand 以外或小專案的選擇，制定起來也沒有那麼繁瑣，不過缺點就是所有作用域內的元件都會受到資料的變動而重新渲染(re-render)，即使該元件只是關係鍊的環節之一未使用到資料，也不可避免地一併渲染，若資料很多互相耦合的情況嚴重就需要考慮是否要使用 Flux 資料管理套件了。
