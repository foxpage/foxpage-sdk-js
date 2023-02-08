import { FoxpageStatus } from './enum';
import { IFoxpageErrorType } from './interface';

export type NotMatchRouterErrorDetail = {
  path: string;
  url?: string;
};

export const NotMatchRouterErrorCode = 'NOT_MATCH_ROUTER_EXCEPTION';

export class NotMatchRouterError extends Error implements IFoxpageErrorType {
  code = NotMatchRouterErrorCode;
  status = FoxpageStatus.NOT_MATCH_ROUTER;
  detail: NotMatchRouterErrorDetail;
  constructor(path: string, url?: string) {
    super(`can't match router by ${url ? 'url' : 'path'}: "${url || path}"`);
    this.detail = {
      path,
      url,
    };
  }
}
