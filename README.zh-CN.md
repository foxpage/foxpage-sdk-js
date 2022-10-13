# Foxpage SDK JS

[![Minimum node.js version](https://img.shields.io/badge/node-%3E%3D12.14.1-brightgreen)](https://img.shields.io/badge/node-%3E%3D12.14.1-brightgreen)
[![typescript version](https://img.shields.io/badge/typescript-%3E%3D4.0.0-brightgreen)](https://img.shields.io/badge/typescript-%3E%3D4.0.0-brightgreen)
[![yarn](https://img.shields.io/badge/yarn-1.22.5-blue)](https://img.shields.io/badge/yarn-1.22.5-blue)
[![coverage](https://img.shields.io/badge/coverage-63%25-green)](https://img.shields.io/badge/coverage-63%25-green)

<h2>为浏览器端和node.js端提供核心能力扩展与支持。</h2>

## 🖥 介绍

### Foxpage Node SDK

是 Foxpage 框架的核心部分，也是为节点应用程序提供的开发工具包。开发人员可以通过使用 SDK 快速接入和使用 Foxpage 框架。

#### 特性

为应用服务提供资源管理、页面解析、页面渲染和插件化等一系列功能。

- **资源管理**. 负责所有依赖的 资源管理。通过 多进程间通讯 方式来同步各个进程间的资源信息，并将资源进行本地 缓存 来提升性能，同时会建立调度器开启 定时任务 来更新本地资源。为了提高扩展性，我们接入了 插件 系统，通过插件来增强相关能力。
- **页面解析**. 包含从用户访问到输出页面结构 DSL 的一系列过程。首先是路由解析，获得用户访问的页面信息，根据页面信息获取所有的依赖信息 relations，并创建上下文，最后通过解析器进行内容解析，输出完整的页面 DSL。
- **页面渲染**. 根据已解析完成的页面 DSL 进行渲染。渲染过程分为：服务端渲染和客户端渲染。
- **插件化**. 为了提高扩展性，支持插件化，通过插件来增强业务领域扩展能力。

### Foxpage JS SDK

Foxpage JS SDK 是供浏览器端使用的，目前提供浏览器端解析和组件加载等工作。

## ✨ 项目结构

```txt
<Project Root>
  ├── .storybook                    // storybook config
  ├── docs                          // docs
  └── packages
  │   ├─foxpage-app-server          // site application
  │   ├─foxpage-browser-loader      // load source in browser
  │   ├─foxpage-core                // foxpage sdk core: for parse DSL
  │   ├─foxpage-engine-react        // react render
  │   ├─foxpage-entry-react         // react csr entry
  │   ├─foxpage-js-sdk              // browser sdk
  │   ├─foxpage-manager             // resource manager
  │   ├─foxpage-middleware-koa      // koa middleware for foxpage node sdk
  │   ├─foxpage-node-sdk            // nodejs sdk
  │   ├─foxpage-plugin              // foxpage plugin core
  │   ├─foxpage-shared              // common utils
  │   ├─foxpage-transformer         // DSL transformer
  │   └─foxpage-types               // common types
  └── jest.config.js                // jest common config
```

## 📦 代码提交

代码提交使用标准 [angular standard](https://github.com/angular/angular/blob/master/CONTRIBUTING.md。

代码提交配置: `commitlint.config.js`。 see: [github](https://github.com/conventional-changelog/commitlint)

代码格式化：[husky](https://github.com/typicode/husky)。

npm:

```shell
npm run commit

// or

npx git-cz
```

## 🌍 NPM 包发布 & 版本发布

1. 在发布之前执行`npm run boot`.
2. `lerna publish --ignore-scripts --no-push` 发布 NPM 包
3. `npm run release -- --release-as patch` or `npm run release -- --release-as minor` 生成新版本: [standard-version](https://github.com/conventional-changelog/standard-version#readme).

## ⏳ 贡献

在向项目提交拉取请求之前，请阅读我们的 贡献指南。

## 🖐 社区支持

有关 Foxpage 使用的一般帮助，请参阅 Foxpage 官方文档。 如需其他帮助，您可以使用以下渠道之一提出问题:

- [GitHub](https://github.com/foxpage/foxpage) (错误报告，贡献)

## 📋 文档中心

- [开发者文档](http://www.foxpage.io/#/developer)
- [进阶](http://www.foxpage.io/#/advance)

## 🏷️ 使用许可

点击 [LICENSE](./LICENSE) 查看更多使用许可信息.
