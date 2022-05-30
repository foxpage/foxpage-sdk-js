import { ContextOrigin } from '@foxpage/foxpage-types';

import { FoxpageStatus } from './enum';
import { IFoxpageErrorType } from './interface';

export type ParseDSLErrorDetail = Partial<ContextOrigin>;

export const ParseDSLErrorCode = 'PARSE_DSL_EXCEPTION';

export class ParseDSLError extends Error implements IFoxpageErrorType {
  code = ParseDSLErrorCode;
  detail: ParseDSLErrorDetail;
  status = FoxpageStatus.DSL_PARSE_ERROR;
  constructor(error: Error, origin: ContextOrigin) {
    super(`parse dsl fail: ${error.message}`);
    this.stack = error.stack;
    this.detail = origin;
  }
}
