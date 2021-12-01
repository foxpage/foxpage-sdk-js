# User Access Guide
用户的某一次访问会经过以下几个核心步骤：获取DSL，解析DSL，渲染页面。下面将详细介绍这几个步骤。

## 一、获取DSL
获取页面`DSL`分两种场景：应用自身管理路由和应用使用`Tag`配置路由。

### 1. 应用自身管理路由
这种方式下`Foxpage Node SDK`不关心页面路由的解析和匹配。应用侧会管理页面和路由之间的关系，当用户访问页面时，应用解析到页面路由，获取到页面的`id`，后面的工作就交给`Foxpage Node SDK`来处理了。

### 2. 应用使用`Tag`配置路由
`Foxpage Node SDK`支持解析Tag配置的路由，通过解析url会得到`slug`，`pathname`，`query`等关键参数信息。通过这三个关键参数，自动生成对应的Tag，根据tag来匹配页面信息。如下：

```ts
// get tags by url queryStrings
const tags = tag.generateTagByQueryString(searchParams.toString());

// get file content by pathname
const file = app.fileManager.getFileByPathname(_pathname);

// match page by tags
return await app.tagManager.matchTag(tags, { pathname: _pathname, fileId: file?.id || '' });
```

## 二、解析DSL
1. 在解析DSL之前需要生成对应的渲染上下文`RenderContext`，
```ts
// appInfo: app content信息
// dsl: page以及依赖的所有资源信息（relationInfo）
 const ctx = await initRenderContextTask(appInfo, dsl);
```

2. 根据`DSL`和渲染上下文解析得到最终页面内容
```ts
// ctx: 渲染上下文 renderContext
const parsed = await parser.parse(dsl, ctx);
```
解析结果如下：
```ts
const result = {
    messages: parser.messages,
    page: {
      id: page.id,
      schemas: parsed,
    },
    ctx: parser.ctx || ctx,
  };
```

## 三、渲染页面
渲染页面阶段主要是根据已解析完成的`DSL`，加载所有的`component`，调用对应的服务端渲染方法生成html内容。

### load components
加载组件部分，会根据`appId`去加载当前应用下所有需要的组件，同时会加载组件的依赖。
```ts
// load components & dependencies
const [components, dependencies] = await loadComponents(dsl, appId);
```

### build & render structure
```ts
// build
const elements = await build(dsl, ctx);

// create
const rootElement = createElement(Container, { ctx }, ...elements);

// render: react
const html: string = ReactDOMServer.renderToStaticMarkup(rootElement);
```