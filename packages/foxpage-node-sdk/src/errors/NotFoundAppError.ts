import { FoxpageStatus } from './enum';
import { IFoxpageErrorType } from './interface';

export type NotFoundAppErrorDetail = {
  appId?: string;
};

export const NotFoundAppCode = 'NOT_FOUND_APP_EXCEPTION';

export class NotFoundAppError extends Error implements IFoxpageErrorType {
  code = NotFoundAppCode;
  detail: NotFoundAppErrorDetail;
  status = FoxpageStatus.NOT_MATCH_ROUTER;
  constructor(appId?: string) {
    super(`can't find application by appId or slug: "${appId}"`);
    this.detail = {
      appId,
    };
  }
}
