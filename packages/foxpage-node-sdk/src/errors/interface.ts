import { FoxpageStatus } from './enum';

export interface IFoxpageErrorType extends Error {
  status: FoxpageStatus;
  code: string;
  detail: any;
}
