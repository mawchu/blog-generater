---
title: 我的第一個完整 React developing note
date: 2025-03-18 20:20:41
tags:
  - React
  - React Context
  - React Hooks
categories: React
---

{% include_md %}

因應公司系統架構的配置接觸到客戶後台的功能開發，順勢記錄一下完整的開發流程在這裡，文中將以化名取代實際專案內容 🫣

<!-- more -->

踩過的坑我們懂得避免，這次選用最多人使用與維護的 Ｎ exT 模板作為新部落格的皮膚。

# 開發背景

首先是專案架構是以一個神奇的方式從 Java MVC 中抽離出來的小綠洲，由於舊的邏輯架構 80% 都還是透過後端開發(全 SSR + sql)不能割捨，打包時須跟隨著捆綁式部署，相信有年代的系統又想跟隨前後端分離的新技術時難免會遭遇到此情境，簡單的看一下架構基礎建設：
| Node -v | Npm | UI framework | Programming language | Build Tool | Git Commit |
|:-----------------:|:-------:| :------------: | :-------------: | :------------: | :--------------: |
| 18+ | yarn | Ant design | Typescript | craco | Husky |

# MVC 運作方式

## 前端打包 module 檔

1. 透過一段 Webpack 設定將寫好了 React 文件打包為模組形式：

   ```js
   const { pluginByName } = require('@craco/craco');

   const entry = {
     main: './src/routers/index-export.js',
     my_module: './src/routers/parentCategory/my_module/index-export.tsx',
   };

   const webpackConfigure = (webpackConfig, env) => {
     webpackConfig.entry = entry;

     webpackConfig.output = {
       ...webpackConfig.output,
       filename: 'modules/[name].bundle.js',
       chunkFilename: 'modules/[id].[contenthash:8].chunk.js',
     };

     /* 修改minicss 导出filename  */
     const MiniCssExtractPlugin = webpackConfig.plugins.find(
       pluginByName('MiniCssExtractPlugin')
     );
     if (MiniCssExtractPlugin) {
       MiniCssExtractPlugin.options.filename = 'static/css/[name].bundle.css';
       MiniCssExtractPlugin.options.chunkFilename =
         'static/css/[id].[contenthash:8].chunk.css';
     }

     const splitChunks = {
       cacheGroups: {
         vendor: {
           test: /[\\/]node_modules[\\/](react|react-dom|antd|moment|react-quill)[\\/]/,
           name: 'vendors',
           chunks: 'all',
         },
         common: {
           name: 'common',
           chunks: 'all',
           minChunks: 2,
           reuseExistingChunk: true,
         },
       },
     };

     webpackConfig.optimization.splitChunks = splitChunks;

     return webpackConfig;
   };

   module.exports = {
     webpackConfigure,
   };
   ```

## 後端開啟入口點

此入口為後端建立起 MVC 架構後的實際 menu，是後端與前端半分離的橋樑 1.

1.  在後端架構裡撰寫一段 `.ftl` 引入 React 打包成 module 檔後的 `my_module.bundle.css` 以及 `my_module.bundle.js`

    ```html
    <div id="root"></div>
    <head>
      <link
        href="/my-project/static/css/my_module.bundle.css"
        rel="stylesheet"
      />
    </head>
    <script src="/my-project/modules/my_module.bundle.js"></script>
    ```

2.  建立入口路由與對應 View：

    ```java
     @GetMapping(value = "/to_myProject")
     public ModelAndView toServer() {
         ModelAndView modelAndView = new ModelAndView();
         modelAndView.setViewName("/MVC_project/.../my_module");
         return modelAndView;
     }
    ```

3.  操作 sql 語法取得 menu 列表與路由權限

    ````html
    <changeSet
      author="mawchu"
      id="123"
      context="global"
    >
      <sql>
        SET @parentMenu = (select menuId from tb_my_table menuname =
        'menu.parent.name' and parentMenu = 0); INSERT INTO tb_my_menu(....)
        VALUES ('menu.my_module', 'menu.my_module', '/.../to_myProject', ...);
        SET @menuid = (select menuId from tb_my_table menuname =
        'menu.my_module'); INSERT INTO tb_my_permission(...) VALUES
        ('menu.my_module', ..., 'menu.my_module'); INSERT INTO
        tb_my_config(....) VALUES ('menu.my_module', '模組名', 'Module Name',
        .....);
      </sql>
    </changeSet>
    ```
    ````

# React 架構分析

由於我是 React 新手還無法使用的出神入化，先參考前人的開發架構當作打底再根據業務邏輯的不同稍做修改：

## 建立 Routers

建立檔案在 /my-project/src/routers/modules/parentCategory.tsx

```tsx
import lazyLoad from '@routers/utils/LazyLoad';
type MyRouteObject = Omit<RouteObject, 'children'> & {
  children?: MyRouteObject[];
  meta?: MetaProps;
};

const parentRouters: MyRouteObject[] = [
  ...{
    path: '/parentCategory/my_module',
    element: lazyLoad(
      () => import('@src/pages/parentCategory/my_module/index')
    ),
    meta: {
      key: 'my_module',
    },
  },
];

export default parentRouters;
```

## 前端入口點

1. 在前端模擬頁面的 menu 新增一個入口點、本地起模擬伺服器脫離 MVC 架構方便除錯用：/my-project/src/config/menuConfig.tsx

   ```tsx
    ...
    const menuConfig: menuItemProps[] = [
        {
        icon: <Icon className='parent_A' />,
        label: 'ParentCategoryA',
        key: '/parentCategoryA',
        includes: [brandMap.D],
        children: [],
        },
        {
        icon: <Icon className='parent_B' />,
        label: 'ParentCategoryB',
        key: '/parentCategoryB',
        // popupOffset: [30, 0],
        popupClassName: 'menu_popup_class',
        children: [
            {
            icon: 'Other Module',
            label: 'Other Module',
            key: '/parentCategory/other_module',
            excludes: [brandMap.A, brandMap.B, brandMap.C],
            },
            {
            icon: '',
            label: 'My Module',
            title: 'My Module',
            key: '/parentCategory/my_module',
            includes: [brandMap.A],
            },
        ],
        },
    ];
    ...
   ```

2. 建立菜單連結：/my-project/src/layouts/components/SideMenu/index.tsx

   ```tsx
   import { useNavigate, useLocation } from 'react-router-dom';
   ...
   const SiderMenu: React.FC<SiderMenuProps> = (props) => {
    ...
    const navigate = useNavigate();
    const clickMenu: MenuProps['onClick'] = ({ key }: { key: string }) => {
        setCollapsed();
        key && navigate(key);
    };
    ...
    return (
        <ConfigProvider theme={MenuTheme}>
        <Menu
            mode='inline'
            items={menuList}
            onClick={clickMenu}
            ...
        />
        </ConfigProvider>
    );
   };
    export default SiderMenu;
   ```

## 串接 API

此專案是根據模塊來分各自的 API：/my-project/src/apis/my_module/index.ts

```ts
import http from '@cores/http';
export const apiGetMyModuleData = (params: Record<string, any>) => {
  return http.post(`/api/parentCategory/myModule`, params);
};
...
```

## 建立業務邏輯

專案的打包點是根據 `build-module.js` 裡的 entry 入口點為一個模組打包的，所以這一次的專案邏輯由此處切入：

## React App 入口點

```
/my-project/src/pages-export/AppExport.jsx
```

```jsx
//...匯入'antd';
//...匯入'recoil';
//...匯入'global api';
//...匯入'ahooks useAsyncEffect';
//...匯入'js-cookie';
//...匯入'dayjs';
//...設定語系 ['antd/locale/en_US', 'antd/locale/zh_CN', ...];
//...設定 'dayjs locale' ['dayjs/locale/en', 'dayjs/locale/zh-cn', ...];
//...匯入'@src/styles/index.less';
//...匯入'@src/provider/ModalForm';
//...匯入'lodash';
//...匯入'react useState';
...
const AppExport = ({ children }) => {
  const [loadend, setLoadend] = useState(false);

  //取得進入權限
  const updateGlobalPermission = useRecoilCallback(
    ({ set }) =>
      async () => {
        try {
          const { data: permissions = {} } = await apiQueryPermission();
          set(globalPermissionAtom, permissions);
          setLoadend(true);
        } catch (error) {
          setLoadend(true);
          console.error('Failed to fetch permissions:', error);
        }
      },
    [],
  );

  useAsyncEffect(async () => {
    updateGlobalPermission();
  }, []);

  return (
    <ConfigProvider theme={{ cssVar: true }} locale={antdLang[localeLang]}>
      <FeatureProvider environment={environment.embedded}>
        <ModalFormProvider>
          {!loadend && (
            <div
              style={{
                display: 'flex',
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
              }}
            >
              <Spin spinning={true} size='large' />
            </div>
          )}
          {loadend && children}
        </ModalFormProvider>
      </FeatureProvider>
    </ConfigProvider>
  );
};

export default ({ children }) => {
  return (
    <RecoilRoot>
      <AppExport>{children}</AppExport>
    </RecoilRoot>
  );
};
```

## 進入開發模塊核心邏輯入口

本次核心的開發邏輯放在以下路徑：

1. 專案精華：/my_project/src/pages/parentCategory/my_module

2. 模塊進入點：src/pages/parentModule/my_module/index-export.tsx

   ```tsx
   import { createRoot } from 'react-dom/client';
   import AppExport from '@src/pages-export/AppExport';
   import App from './index';

   const root = createRoot(document.getElementById('root') as HTMLElement);

   root.render(
     <AppExport>
       <App />
     </AppExport>
   );
   ```

3. 模塊架構圖
   <img style='margin-right: unset; margin-left: unset; padding-top: 12px' src='/blog/images/my-first-react-task-0.jpg' width='min(100%, 600px)' height='auto'>

   應用到的幾個技術點：
   (1) 整併 API 取得的共用資源在 hooks 中：./hooks/…

   ```tsx
    import {
        apiGetDataList,
        ...
    } from '@src/apis/my_module';
    ...

    export default function useQueryDatas() {
        const { t } = useTranslation();
        const [dataList, setDataList] = useState<IBlockList>([]);
        const [loading, setLoading] = useState<boolean>(false);
        const queryDataList = (params: any, isBlackList: boolean) => {
            setLoading(true);
            apiGetDataList(params)
                .then((res: any) => {
                    const data =
                    res?.data?.map(
                        (
                            {
                                ...
                            }: any,
                            index: number,
                        ) => {
                        return {
                            ...
                        };
                        },
                    ) || [];
                    setDataList((prevList: any) => {
                        return {
                        //Filter Logic
                        ...
                        };
                    });
                    // console.log('blockList:', blockList);
                })
            .catch((error: any) => {
                console.log('error', error);
            })
            .finally(() => {
                console.log('loading', loading);
                setLoading(false);
            });
        }

        return {
            loading,
            handleLoading,
            queryDataList,
            setDataList,
            ...
        };
    }
   ```

   (2) 使用 context 互享共用資源，包裝 useState 來偵測資料變化觸發巢狀元件渲染：./context/…

   ```tsx
   import useQueryDatas from '../hooks/useQueryDatas';
   import { FC, ReactNode, createContext, useContext, useMemo, useState } from 'react';
   ...
   // 跳過型別設定
   export const initialState: myModuleState = {
       deviceWidth: 0, // 跨元件共用資源可以放進來
       setDeviceWidth: () => {},
       setDataList: () => {},
       queryDataList: () => {}, // Api Hook
       blockList: [],
       loading: false,
       handleLoading: () => {},
       ...
   };
   const myModuleContext = createContext<myModuleState>({
       ...initialState,
   });
   export const useMyModuleContext = () => {
       const state = useContext(myModuleContext);
       if (state === null) {
           throw new Error('useStore must be used within a StoreProvider.');
       }
       // console.log('state', state);
       return state;
   };

   export const myModuleProvider: FC<{ children: ReactNode }> = ({ children }) => {
       const {
           deviceWidth,
           setDeviceWidth,
           setDataList,
           queryDataList,
           dataList,
           loading,
           handleLoading,
           ...
       }: any = useQueryDatas();
       const [deviceWidth, setDeviceWidth] = useState<number>(0);
       const [isBlackList, setIsBlackList] = useState<boolean | null>(null);

       const value = useMemo( // 減少非必要的元件渲染
           () => ({
               deviceWidth,
               setDeviceWidth,
               setDataList,
               queryDataList,
               dataList,
               loading,
               handleLoading,
           }),
           [deviceWidth, dataList, loading], // data dependencies for memo
       );

       return (
           <myModuleContext.Provider value={value}>{children}</myModuleContext.Provider>
       );
   };
   ```

   (3) 在跨元件間複雜資料包裝 useReducer 操作表單資料：./hooks

   ```tsx
   export const myModuleReducer = (state: myModuleParams, action: IAction) => {
     const { type, payload } = action;
     // 撰寫同一份資料的 CRUD 邏輯，要注意使用解構來保持其他資料或巢狀資料的原始參考（immutable update）
     switch (type) {
       case EActionTypes.SEARCH:
         return {
           ...state,
           ...payload,
         };
       case EActionTypes.SEARCH_RESET:
         delete state.blockType;
         return {
           keyData: state.keyData,
           ...payload,
         };
       case EActionTypes.ADD_ITEM:
         return {
           ...state,
           ...payload,
         };
       // 陣列
       default:
         return state;
     }
   };
   ```

# useContext 解決 props drilling

開發到一半時才發現多個元件都需要使用同一套資料，而且數量頗多的情況下，即便開發時程緊湊還是硬著頭皮在某個週末加班來釐清資料如何拆分，此篇應用可以結合閱讀[React Context pitfalls - 踩雷經驗](/blog/2025/03/13/my-first-react-task/)

最大好處是可以避免 props drilling 並透過 hooks 只拿該元件需要的資料：./components/…

```tsx
...
// reducer
import { myModuleReducer } from '../hooks/useDataParams';
// context
import { useMyModuleContext } from '../contexts/myModule';

// child component
const AddModal: React.FC<IAddModalProps> = ({
    ...
    //props
}: IAddModalProps) => {
    // 只拿該元件要用的 context 資料與 setter
    const { dataList, handleLoading, ... } = useMyModuleContext();
    // 操作的業務邏輯放這裡
    ...
    return (
        <Modal
            title={title}
            open={isModalOpen}
            okText='Submit'
            okButtonProps={{ disabled: !submittable }}
            onOk={handleOk}
            onCancel={handleCancel}
        >
            ...
        </Modal>
    );
}
```

如此一來就可以輕鬆地在巢狀子元件提取需要的共用資源外，同時操控 Setter 修改資料並觸發渲染囉！
以上分享本次的開發經驗 :D
