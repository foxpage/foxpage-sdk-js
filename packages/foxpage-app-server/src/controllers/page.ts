import { Context } from 'koa';

import { pageService } from '../services';

class PageController {
  /**
   *  renderToHtml
   *
   * @param {Context} ctx
   */
  renderToHTML = async (ctx: Context) => {
    try {
      const body = ctx.request.body as unknown as { app_id: string; page_id: string };
      const app_id = body.app_id ? body.app_id : '';
      const page_id = body.page_id ? body.page_id : '';
      const res = await pageService.render(app_id, page_id, ctx);
      ctx.body = res;
      ctx.status = 200;
    } catch (e) {
      ctx.status = 400;
      ctx.body = (e as Error).message;
    }
  };
}

export default new PageController();
