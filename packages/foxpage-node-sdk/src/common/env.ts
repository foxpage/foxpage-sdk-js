import { Context, RequestMode } from '@foxpage/foxpage-types';

const parseParams =
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
export const isPreviewMode = parseParams({ ctxKey: 'isPreviewMode', queryKey: 'preview' });

/**
 * check is debug mode
 */
export const isDebugMode = parseParams({ ctxKey: 'isDebugMode', queryKey: 'debug' });

/**
 * check is debug mode
 */
export const isMock = parseParams({ ctxKey: 'isMock', queryKey: 'mock' });

/**
 * init mode
 * @param ctx context
 */
export const initEnv = (ctx: Context) => {
  ctx.isPreviewMode = ctx.isPreviewMode || isPreviewMode(ctx);
  ctx.isDebugMode = ctx.isDebugMode || isDebugMode(ctx);
  ctx.isMock = ctx.isMock || isMock(ctx);
};
