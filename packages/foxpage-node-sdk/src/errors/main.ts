import { FoxpageStatus } from './enum';

export function getStatusByError(error: Error & { code?: string; status?: FoxpageStatus }) {
  return error.status || FoxpageStatus.FAIL;
}
