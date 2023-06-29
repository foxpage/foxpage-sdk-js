import { Context, RequestMode } from '@foxpage/foxpage-types';

const PREFIX = '_foxpage_';
const PREVIEW = 'preview';
const PREVIEW_TIME = 'preview_time';
const DEBUG = 'debug';
const MOCK = 'mock';
const CANARY = 'canary';
const TICKET = 'ticket';
const PAGE_ID = 'pageid';

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
export const isPreview =
  parseParams({ ctxKey: 'isPreviewMode', queryKey: PREVIEW }) ||
  parseParams({ ctxKey: 'isPreviewMode', queryKey: `${PREFIX}${PREVIEW}` });

/**
 * check is debug mode
 */
export const isDebug =
  parseParams({ ctxKey: 'isDebugMode', queryKey: DEBUG }) ||
  parseParams({ ctxKey: 'isDebugMode', queryKey: `${PREFIX}${DEBUG}` });

/**
 * check is debug mode
 */
export const isMock =
  parseParams({ ctxKey: 'isMock', queryKey: MOCK }) || parseParams({ ctxKey: 'isMock', queryKey: `${PREFIX}${MOCK}` });

/**
 * check is canary mode
 */
export const isCanary = parseParams({ ctxKey: 'isCanary', queryKey: `${PREFIX}${CANARY}` });

/**
 * init canary
 * @param ctx
 * @returns
 */
export const initCanary = (ctx: Context) => {
  // headers
  // had x-ctx-fox-canaryReq = 1;
  const _isCanary = ctx.request?.headers?.['x-ctx-fox-canaryreq'];
  return isCanary(ctx) || !!_isCanary;
};

/**
 * init mode
 * @param ctx context
 */
export const initEnv = (ctx: Context) => {
  ctx.isPreviewMode = ctx.isPreviewMode || isPreview(ctx);
  ctx.isDebugMode = ctx.isDebugMode || isDebug(ctx);
  ctx.isMock = ctx.isMock || isMock(ctx);
  ctx.isCanary = ctx.isCanary || initCanary(ctx);
};

/**
 * is prod
 * @param ctx
 * @returns
 */
export const isProd = (ctx: Context) => {
  return !(ctx.isPreviewMode || ctx.isDebugMode || ctx.isMock || ctx.isCanary);
};

/**
 * get foxpage preview time
 * @param ctx context
 * @returns preview time
 */
export function getFoxpagePreviewTime(ctx: Context): string | undefined {
  return ctx?.URL?.searchParams?.get(`${PREFIX}${PREVIEW_TIME}`) || undefined;
}

/**
 * get foxpage access control ticket
 * @param ctx context
 * @returns ticket
 */
export function getTicket(ctx: Context): string | undefined {
  return ctx?.URL?.searchParams?.get(`${PREFIX}${TICKET}`) || undefined;
}

/**
 * get pageId
 * @param ctx
 * @returns
 */
export function getPageId(ctx: Context): string | undefined {
  return ctx?.URL?.searchParams?.get(PAGE_ID) || undefined;
}
