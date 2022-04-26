import { join } from 'path';

import { readJsonSync } from 'fs-extra';
import Koa from 'koa';
import serve from 'koa-static-cache';

import proxy, { Koa2ProxyMiddlewareConfig } from './proxy';

const PATH = '/foxpage/static';
const LIBRARY_PATH = join(process.cwd(), 'library');
const LIBRARY_MANIFEST = join(LIBRARY_PATH, 'manifest.json');

export type FoxpageStaticOptions = {
  enable?: boolean;
  path?: string;
};

/**
 * foxpage static serve handler
 * @param app koa app
 */
export const foxpageStaticHandler = (app: Koa, opt: FoxpageStaticOptions = { path: PATH }) => {
  const path = opt.path || PATH;
  const library = serve(join(process.cwd(), 'library'), {
    maxAge: 10 * 24 * 60 * 60,
  });
  // init static server
  app.use(library);

  // init proxy options
  let options: Koa2ProxyMiddlewareConfig = { targets: {} };
  try {
    const libraries: Record<string, string> = readJsonSync(LIBRARY_MANIFEST);
    options = {
      targets: {
        [`${path}/(.*).js`]: {
          // target: 'http://localhost:3000',
          changeOrigin: true,
          pathRewrite: (requestPath: string) => {
            return libraries[requestPath.replace(`${path}/`, '')] || '/404';
          },
        },
      },
    };
  } catch (e) {
    const msg = 'init static server proxy failed:' + (e as Error).message;
    console.error(msg);
    throw new Error(msg);
  }

  // proxy to static server
  app.use(proxy(options));
};
