import { Context, RequestMode } from '@foxpage/foxpage-types';

const isMode =
  ({ ctxKey, queryKey }: { ctxKey: keyof RequestMode; queryKey: string }) =>
  (ctx?: Partial<Context>): boolean => {
    if (ctx) {
      if (ctx[ctxKey] === undefined) {
        ctx[ctxKey] = ctx?.URL?.searchParams?.has(queryKey) ?? false;
      }
      return !!ctx[ctxKey];
    }
    return false;
  };

/**
 * check is preview mode
 */
export const isPreviewMode = isMode({ ctxKey: 'isPreviewMode', queryKey: 'preview' });

/**
 * check is debug mode
 */
export const isDebugMode = isMode({ ctxKey: 'isDebugMode', queryKey: 'debug' });

/**
 * init mode
 * @param ctx context
 */
export const initMode = (ctx: Context) => {
  ctx.isPreviewMode = isPreviewMode(ctx);
  ctx.isDebugMode = isDebugMode(ctx);
};
