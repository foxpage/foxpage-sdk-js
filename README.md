# Foxpage SDK JS

Foxpage SDK for JavaScript in the browser and Node.js.

## ✨ Project

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
  │   ├─foxpage-plugin-*            // foxpage sys plugin
  │   ├─foxpage-shared              // common utils
  │   ├─foxpage-transformer         // DSL transformer
  │   └─foxpage-types               // common types
  └── jest.config.js                // jest common config
```

## 🖥 Environment Support
[![Minimum node.js version](https://img.shields.io/badge/node-%3E%3D12.14.1-brightgreen)](https://img.shields.io/badge/node-%3E%3D12.14.1-brightgreen)
[![typescript version](https://img.shields.io/badge/typescript-%3E%3D4.0.0-brightgreen)](https://img.shields.io/badge/typescript-%3E%3D4.0.0-brightgreen)
[![yarn](https://img.shields.io/badge/yarn-1.22.5-blue)](https://img.shields.io/badge/yarn-1.22.5-blue)

## ⌨️ Development
clone locally:

```bash
$ git clone https://github.com/foxpage/foxpage-sdk-js.git
$ cd foxpage-sdk-js
$ yarn boot
```

## 📦 Commit

commit used [angular standard](https://github.com/angular/angular/blob/master/CONTRIBUTING.md。

commit config: `commitlint.config.js`。 see: [github](https://github.com/conventional-changelog/commitlint)

commit lint by [husky](https://github.com/typicode/husky)。

npm:

```shell
npm run commit

// or

npx git-cz
```

## 🌍 publish & Release

1. `npm run boot` and succeed before publish.
2. `lerna publish --ignore-scripts --no-push` to publish public packages
3. `npm run release -- --release-as patch` or `npm run release -- --release-as minor` generate new version: [standard-version](https://github.com/conventional-changelog/standard-version#readme).
