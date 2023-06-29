import { FoxpageStatus } from './enum';
import { IFoxpageErrorType } from './interface';

export type AccessDeniedErrorDetail = {
  value?: string;
};

export const AccessDeniedCode = 'ACCESS_DENIED_EXCEPTION';

export class AccessDeniedError extends Error implements IFoxpageErrorType {
  code = AccessDeniedCode;
  detail: AccessDeniedErrorDetail;
  status = FoxpageStatus.ACCESS_DENIED;
  constructor(value?: string) {
    super(`Access denied of "${value}"`);
    this.detail = {
      value,
    };
  }
}
