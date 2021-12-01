import Axios from 'axios';

import { ManagerOption } from '@foxpage/foxpage-types';

import { createLogger } from '../common';

const TOKEN =
  'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzZXItZHZiZlcxcXNsOHFrejM5IiwiYWNjb3VudCI6ImZveC11c2VyIiwiaWF0IjoxNjMzNzQ2ODExLCJleHAiOjE2NDIzODY4MTF9.C6ySkpQcVojGks-MdgiM22Zf5zYngd8MJVtYWMFQkiXHzwzrUh1DAhxDy9z3Kj3JCVVmQePcY-bGJCnNjNNkcMmKdBh0xbEwRdcOt3pmlHhZHhAPzPH7AjrNw9fLSX2Plj3NMlFnsOgQ81HHinY0DFGSVFF8NhtwLZ7SC6HFJCxodYC45FrD0fBAtoAxG_Zs9C7esTNKTzqxgPVN5rmR-loZnCE5YhLMYVOBTrRj-BpxyYdn3_FFBUzeuGKH3O3LxkiFV13xMJoJT1Am2ymJazdftfD0CqMYRAdEToz_jelmEyOEVkNJMLF7SbQlRAzAFQ68956P5In2mkmcJA4oq2QF75c51_7wGsXWYAnDH9CTyAd0IbqdxllHZsSt82J6vHOyXSm-9m2IHsEDbdw3D-FSY_NnPH3c-ZHSVom7l2h2W47ETWgJg1FyBb636jn35MDbI1FHjB1zmgWDH9yms6glNlJUFRSH2k-DFDvHwTuXLrE-E6Lh2StMCF1TTwburD2dkZyekmbSOH2qrSF8NUPHQET7kYlIQui9khH8E7LahlWSuuVn2EE7HbGdBxf2FW3RbaE0rIoA305EcYA1jS9X0r6o9Y37iHbQOJLYS4X-iZplcjqIG9l8mmKNbgjDUS1L9-Su7Z8vlaZa-UTKb-_1TAqOmDVU4VPh2UKsUKM';

const logger = createLogger('DataService/request');

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

function handleError(err: Error, detail: { api: string; method: string; params: Record<string, unknown> }) {
  const { api, method } = detail;
  return `[DATA SERVICE] [${api}]<${method}> Error: ${err.message}, detail: ${JSON.stringify(detail)}`;
}

/**
 * create request
 * @param opt request options
 * @returns {FoxpageRequest}
 */
export const createRequest = (opt: ManagerOption['dataService']): FoxpageRequest => {
  return async function request<T>(
    method: RequestMethod,
    api: string,
    params: Record<string, unknown>,
    { throwError = false }: Record<string, unknown> = {},
  ) {
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
      if (data.code === 200) {
        return result.data.data as unknown as T;
      } else {
        throw new Error(data.msg || 'fetched failed');
      }
    } catch (e) {
      let err: Error;
      const { message } = e as Error;
      if (message) {
        err = new Error(message);
      } else {
        err = new Error(`request failed.`);
      }

      err.message = handleError(err, { api, method, params });
      logger.error('invoke error.', err);
      if (!throwError) {
        return null;
      }
      throw err;
    }
  };
};
