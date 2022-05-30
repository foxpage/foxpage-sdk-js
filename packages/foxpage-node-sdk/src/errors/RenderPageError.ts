import { Page } from '@foxpage/foxpage-types';

import { FoxpageStatus } from './enum';
import { IFoxpageErrorType } from './interface';

export const RenderPageErrorCode = 'RENDER_PAGE_EXCEPTION';

export class RenderPageError extends Error implements IFoxpageErrorType {
  code = RenderPageErrorCode;
  detail: Page;
  status = FoxpageStatus.PAGE_RENDER_ERROR;
  constructor(error: Error, dsl: Page) {
    super(`render dsl "${dsl.id}" fail: ${error.message}`);
    this.stack = error.stack;
    this.detail = dsl;
  }
}
