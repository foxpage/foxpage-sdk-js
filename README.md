# Foxpage SDK JS
[![Minimum node.js version](https://img.shields.io/badge/node-%3E%3D12.14.1-brightgreen)](https://img.shields.io/badge/node-%3E%3D12.14.1-brightgreen)
[![typescript version](https://img.shields.io/badge/typescript-%3E%3D4.0.0-brightgreen)](https://img.shields.io/badge/typescript-%3E%3D4.0.0-brightgreen)
[![yarn](https://img.shields.io/badge/yarn-1.22.5-blue)](https://img.shields.io/badge/yarn-1.22.5-blue)
[![coverage](https://img.shields.io/badge/coverage-63%25-green)](https://img.shields.io/badge/coverage-63%25-green)

<h2>Foxpage SDK for JavaScript in the browser and node.js.</h2>

## 🖥  Introduction

### Foxpage Node SDK
It is the core part of the Foxpage framework and a development kit provided for node applications. Developers can quickly access and use the Foxpage framework by using the SDK.
#### Features
Provide a series of features such as resource management, page parse, page rendering and plug-in for application services.

- **Resource Management**. Responsible for all dependent resource management, synchronize resource information between processes through multi-process communication, cache resources locally to improve performance, and create a scheduler to open timed tasks to update local resources.
- **Page parse**. Contains a series of processes from user access to output page structure DSL. The first is route parsing, which obtains the page information accessed by the user, obtains all dependency information relations according to the page information, and creates the context, and finally performs content parsing through the parser to output the complete page DSL.
- **Page render**. Render according to the parsed page DSL. The rendering process is divided into: server-side rendering(SSR) and client-side rendering(CSR).
- **Plug-in**. In order to improve scalability, support plug-in, and enhance the expansion ability of business fields through plug-ins.

### Foxpage JS SDK
Foxpage JS SDK is for browser use. Currently, provides browser-side parsing and component loading.

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

## ⌨️ Development
clone locally:

```bash
$ git clone git@git.dev.sh.ctripcorp.com:fox-open/foxpage-sdk-js.git
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

## ⏳ Contributing

Please read our [Contributing Guide](http://www.foxpage.io/#/guide/contribute) before submitting a Pull Request to the project.

## 🖐 Community support

For general help using Foxpage, please refer to [the official Foxpage documentation](http://www.foxpage.io). For additional help, you can use one of these channels to ask a question:

- [GitHub](https://github.com/foxpage/foxpage) (Bug reports, Contributions)

## 📋 Documentation

See our documentation live [Docs](http://www.foxpage.io) for the Foxpage SDK.

- [Developer docs](http://www.foxpage.io/#/developer)
- [Advance guide](http://www.foxpage.io/#/advance)

## 🏷️ License

See the [LICENSE](./LICENSE) file for licensing information.
