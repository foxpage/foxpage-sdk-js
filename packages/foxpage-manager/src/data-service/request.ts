import Axios from 'axios';

import { ManagerOption } from '@foxpage/foxpage-types';

interface WebApiResponse<T> {
  data?: T;
  code: 200 | 400 | 401 | 403 | 404 | 500;
  msg?: string;
  err?: Record<string, unknown>[] | Record<string, unknown>;
}

type RequestMethod = 'get' | 'delete' | 'post' | 'put' | 'patch';

interface FPAxiosResponse<T> {
  data: WebApiResponse<T>;
}

/**
 *  foxpage webApi request
 */
export type FoxpageRequest = <T>(
  method: RequestMethod,
  api: string,
  params: Record<string, unknown>,
  opt?: {
    throwError: boolean;
  },
) => Promise<T | null>;

function handleError(
  err: Error,
  detail: { host: string; api: string; method: string; params: Record<string, unknown> },
) {
  const { api, method } = detail;
  return `[DATA SERVICE] [${api}]<${method}> Error: ${err.message}, detail: ${JSON.stringify(detail)}`;
}

/**
 * create request
 * @param opt request options
 * @returns {FoxpageRequest}
 */
export const createRequest = (opt: ManagerOption['dataService']): FoxpageRequest => {
  return async function request<T>(method: RequestMethod, api: string, params: Record<string, unknown>) {
    try {
      const url = `${opt.host}${opt.path || ''}${api}`;
      const result: FPAxiosResponse<T> = await Axios({
        method,
        url,
        params: method === 'get' ? params : undefined,
        data: method !== 'get' ? params : undefined,
        timeout: opt.timeout || 10 * 1000,
      });

      const { data } = result;
      if (data?.code === 200) {
        return result.data.data as unknown as T;
      } else {
        throw new Error('code:' + data.code + ', msg:' + (data?.msg || 'fetched failed'));
      }
    } catch (e) {
      let err: Error;
      const { message } = e as Error;
      if (message) {
        err = new Error(message);
      } else {
        err = new Error(`request failed.`);
      }

      err.message = handleError(err, { host: opt.host, api, method, params });
      throw err;
    }
  };
};
