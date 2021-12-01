import { Context } from 'koa';
import Router from 'koa-router';

import { pageController } from './controllers';

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

export const routes = router.routes();
