# component loader
统一浏览器端组件加载能力，支持多版本组件依赖

## 使用
1. 引入`foxpage-js-sdk`
```shell
npm install @foxpage/foxpage-js-sdk --save
```


2. 示例
```ts
import { loader } from '@foxpage/foxpage-js-sdk';
...
// 1: init framework
loader.initFramework({
  requirejsLink: initialState.requirejsLink, // url
  libs: initialState.libs, //  ModuleConfigs
  win: initialState.window, // option
});

...
// 2: config components
loader.configComponent(
  {
    name: component.name,
    version: component.version,
    url: component.browserURL,
    deps: component.dependencies, //["demo1","demo2"]
    meta: component.meta,
    ...
  }
);
// 3: load components
loader.loadComponent(name, version);
```
