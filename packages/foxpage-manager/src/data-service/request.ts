import Axios from 'axios';

import { ManagerOption } from '@foxpage/foxpage-types';

// TODO: will remove it
const TOKEN =
  'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzZXItZHZiZlcxcXNsOHFrejM5IiwiYWNjb3VudCI6ImZveC11c2VyIiwiaWF0IjoxNjM4MzI2OTE4LCJleHAiOjE2NDY5NjY5MTh9.Hzcq8sjZn7SiZ1FBf4HKBdebMH5A922w-q_SCqSR9qTYYVNArmcoevjIYFPTz0FwowDu899xplO72v1zNpwo6Gjxx1ynMRcjziTUUXYhmLKEuIuhimt5lVbc5byrOPRSkHatgtkDPF7PtC390a9BYzlmCg11BTNM_bAMI5MkCZYduTw2ZW0CK8R_aoz-Hj8i0NlW9vJt6KPC7vsBQBdiv92Z0Gerz7n0V-5RhTYZVJyIQFzuddNmrdMg_YrQH46ESm5ZJ-cKzYac8Pfi6YU-5FfHd3XqnUfGTgfaxnL7WhtgrEkDHkg1CINynBALPkEUNTCMvINMNhbso-IVd5mmEcqheNzLiHFLXI8dAQjHXoBq6xycBicp-P6D1sjFrPSJHkqvPngqUP1wXendHPEcT8zChj0Jf0-GET986bAZLWowpaRvDvS_EkOBfu1GJ5vWXasPcWvheFXX490OT8zuaWidJdfE-l1CgGYhjhxzWEZBwZ9EWVgUcpH2NYsodpaiiCXANRqyL3AwNyUnCr6XM2dYy8SEuNm0XV4T8Us968EUOaKldTjXGBNSX_e1IH7eegSdV2LiFSg2F0VYXatdClIIPo2c4S5TIyTJpdCfJFraLvZC6EvFqb5d_OmzLFbpnoJvFjDVm9TpzLLiY3HdcM_icKpHxIlFHJmiYbsxObg';

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
        headers: {
          token: TOKEN,
        },
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
