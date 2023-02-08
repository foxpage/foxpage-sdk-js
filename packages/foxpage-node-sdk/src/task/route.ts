import { Context } from '@foxpage/foxpage-types';

/**
 * get pathname
 * @param ctx
 * @returns
 */
export const getPathname = (slug: string, ctx: Context) => {
  const { path = '', rewrite } = ctx.matchedRoute || {};
  const { pathname = '' } = ctx.URL || {};

  // rewrite by app customize
  if (rewrite) {
    let rewritePath = '';
    if (typeof rewrite === 'string') {
      rewritePath = rewrite;
    } else if (typeof rewrite === 'function') {
      rewritePath = rewrite(pathname) || '';
    }
    return rewritePath;
  }

  const replaceRoute = path || (slug ? `/${slug}/` : '');
  return replaceRoute ? pathname.replace(replaceRoute, '/') : pathname;
};
