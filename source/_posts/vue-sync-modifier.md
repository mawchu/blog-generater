---
title: Vue 雙向綁定語法糖 - sync modifier
date: 2024-09-05 17:26:56
categories: Vue
tags:
- Vue2
- Vue3
- sync modifier
---

{% include_md %}
本篇整理一下除了 v-model 以外的幾種雙向綁定實作方法：`.sync` 與 `computed()`。
<!-- more -->
Vue 2 在 2.3.0+ 版本新增了 `.sync` 提供父子組件雙向綁定（Two-way data binding）的語法糖，讓撰寫上更輕便簡潔的處理 Props 資料。
# Equivalent Without .sync
先來比較一下不使用 `.sync` 語法糖的區別。

## Child
子組件內部的控制透過 `$emit` 以及 `update:` 來控制雙向綁定達到 `set()` 效果。
```js
<template>
  <div v-if="visible" class="drawer">
    <div class="drawer-content">
      <slot></slot>
    </div>
    <el-button @click="closeDrawer">Close Drawer</el-button>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    closeDrawer() {
      this.$emit('update:visible', false); // Emit event to update visibility in the parent
    }
  }
}
</script>

```

## Parent
父組件需要使用 `@update` 前綴承接子組件傳遞的 `$event` 資料，來控制抽屜的顯示 `isDrawerVisible`：
```js
<template>
  <div>
    <el-drawer :visible="isDrawerVisible" @update:visible="handleDrawerVisible">
      <!-- Drawer content -->
    </el-drawer>
    <el-button @click="openDrawer">Open Drawer</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isDrawerVisible: false // Control drawer visibility
    };
  },
  methods: {
    openDrawer() {
      this.isDrawerVisible = true; // Open the drawer
    },
    handleDrawerVisible(val) {
      this.isDrawerVisible = val; // Sync visibility based on the event from child
    }
  }
}
</script>
```

# Equivalent With .sync
來感受一下`.sync` 語法糖的魅力。

## Child
子組件內部的控制一樣透過 `$emit` 以及 `update:` 來控制雙向綁定達到 `set()` 效果。
```js
<template>
  <div v-if="visible" class="drawer">
    <div class="drawer-content">
      <slot></slot>
    </div>
    
    <!-- Button to close the drawer -->
    <el-button @click="closeDrawer">Close Drawer</el-button>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    closeDrawer() {
      // Emit update:visible to inform the parent that the drawer should close
      this.$emit('update:visible', false);
    }
  }
}
</script>
```

## Parent
父組件可以直接省略綁定事件的 `@update` ：
```js
<template>
  <div>
    <el-drawer :visible.sync="isDrawerVisible" title="Drawer Title">
      <div>Drawer Content</div>
    </el-drawer>
    
    <!-- Button to open the drawer -->
    <el-button @click="openDrawer">Open Drawer</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isDrawerVisible: false // Controls the visibility of the drawer
    };
  },
  methods: {
    openDrawer() {
      this.isDrawerVisible = true; // Open the drawer
    }
  }
}
</script>
```

# Comparison with computed
使用 `computed` 的雙向綁定需要透過 `get()` 與 `set()` 來實作。
## Child
子組件內部的控制一樣透過 `$emit` 以及 `update:` 來控制雙向綁定達到 `set()` 效果。
```js
<template>
  <div v-if="visible" class="drawer">
    <div class="drawer-content">
      <slot></slot>
    </div>
    
    <!-- Button to close the drawer -->
    <el-button @click="closeDrawer">Close Drawer</el-button>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    closeDrawer() {
      // Emit update:visible to inform the parent that the drawer should close
      this.$emit('update:visible', false);
    }
  }
}
</script>
```

## Parent
父組件使用 `set()` 可以增加更多客製化的空間，在傳遞值給子組件之前制定 Validation、更改值或者觸發副作用（Side effects）：
```js
<template>
  <el-drawer :visible="isDrawerVisible" @close="handleClose">
    <div>Drawer Content</div>
  </el-drawer>

  <el-button @click="openDrawer">Open Drawer</el-button>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    isDrawerVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit('update:visible', val);
      }
    }
  },
  methods: {
    openDrawer() {
      this.isDrawerVisible = true; // Opens the drawer
    },
    handleClose() {
      this.isDrawerVisible = false; // Closes the drawer
    }
  }
};
</script>
```

# Datailed Comparison
簡單比較一下使用語法糖 `.sync` 與使用原生作法 `get()` & `set()` 的差異：
|              |     .sync Version  |        Computed Property Version         |
|:----------------------|:------:|:-----------------------------------------|
|   友善度     |  較少 Boilerplate   |           較多 Boilerplate         |
|   客製度     |  父組件無   |           父子組件可靈活設計         |
|   Vue3 兼容     |  不鼓勵   |           兼容性佳         |
|  響應度     |  自動  |           需要手寫處理        |
|  錯誤控制     |  父組件無  |           父子組件可靈活設計        |

# 使用場景
簡單的 switch 操作十分適合 `.sync` 簡化寫法，而當資料需要雙向客製化或者不同處理時，例如副作用或驗證就建議使用 `computed()` 來添加額外的邏輯，是 Vue3 推薦的一種實作方法。ｓ