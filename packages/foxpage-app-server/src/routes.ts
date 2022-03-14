import { join } from 'path';

import { pathExists, readFile, readJSON } from 'fs-extra';
import { Context } from 'koa';
import Router from 'koa-router';

import { pageController } from './controllers';

const PATH = '/resource';
const LIBRARY_PATH = join(__dirname, '..', 'library');
const LIBRARY_MANIFEST = join(LIBRARY_PATH, 'manifest.json');

const router = new Router();

router.all('/healthcheck', async ctx => {
  ctx.body = 'Hello Foxpage!!!';
});

router.post('/pages/renderToHtml', pageController.renderToHTML);

router.get('/pages/renderTest', (ctx: Context) => {
  const { app_id, page_id } = ctx.request.query || {};
  ctx.request.body = { app_id, page_id };
  // ctx.request.body = { app_id: 'appl_EJlrKxog8TmgvLA', page_id: 'cont_i8GinG3VthF8LUs' };
  return pageController.renderToHTML(ctx);
});

// router.all('/debug.js', ctx => {
//   const path = join(__dirname, '..', '..', 'foxpage-debug-portal', 'dist', 'debug.js');
//   ctx.body = require(path);
// });

router.all(`${PATH}/*.js`, async (ctx: Context) => {
  try {
    const exit = await pathExists(LIBRARY_MANIFEST);
    if (exit) {
      const result: Record<string, string> = await readJSON(LIBRARY_MANIFEST);
      const key = ctx.path.replace(`${PATH}/`, '');
      const resourcePath = result[key];
      if (resourcePath) {
        const realPath = join(LIBRARY_PATH, resourcePath);
        ctx.body = await readFile(realPath);
        ctx.set('content-type', 'application/javascript; charset=utf-8');
        ctx.status = 200;
      } else {
        ctx.body = 'Get the resource is empty.';
        ctx.status = 404;
      }
    } else {
      ctx.body = 'Get the resource is empty.';
      ctx.status = 404;
    }
  } catch (e) {
    ctx.body = 'Get the resource failed: ' + (e as Error).message;
    ctx.status = 500;
  }
});

export const routes = router.routes();
