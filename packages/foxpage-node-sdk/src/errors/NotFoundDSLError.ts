import { IFoxpageErrorType } from './interface';

export type NotFoundDSLErrorDetail = {
  pageId?: string;
};

export const NotFoundDSLErrorCode = 'NOT_FOUND_DSL_EXCEPTION';

export class NotFoundDSLError extends Error implements IFoxpageErrorType {
  code = NotFoundDSLErrorCode;
  detail: NotFoundDSLErrorDetail;
  status = 404;
  constructor(pageId?: string) {
    super(`can't find dsl by page: "${pageId}"`);
    this.detail = {
      pageId,
    };
  }
}
