# Foxpage JS SDK page parse
提供浏览器端页面合并（`page` + `template`）和解析（`page`，`variable`，`condition`，`function`）的能力。

## 使用
1. 引入`foxpage-js-sdk`
```shell
npm install @foxpage/foxpage-js-sdk --save
```

2. 示例
```ts
import { parsePage } from '@foxpage/foxpage-js-sdk';

...
// 传参示例
const appInfo: RenderAppInfo = {
  appId: '1000',
  slug: '/test',
  configs: {},
};
const relationInfo = {
  templates: [template], // Template[]
  variables: [variable], // Variable[]
  conditions: [condition], // Condition[]
  functions: [fn], //FPFunction[]
};

// parsePage 异步方法
// page -> Page: page content
const parsed = await parsePage(page, { appInfo, relationInfo });
...

```

## 类型说明
1. 过程中依赖的类型都在`foxpage-types`中, 可根据需要引入该模块
```shell
npm install @foxpage/foxpage-types --save
```
