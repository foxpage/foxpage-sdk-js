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
