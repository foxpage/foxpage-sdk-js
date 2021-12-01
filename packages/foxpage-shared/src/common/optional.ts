import isError from 'lodash/isError';

interface IOption<T> {
  readonly error?: Error | null;
  readonly code?: number | null;
  readonly data?: T | null;
  readonly ok: boolean;
  readonly fail: boolean;
  unwrap(): T | never;
}

export interface OptionOk<T> extends IOption<T> {
  readonly error: null;
  readonly code: null;
  readonly data: T;
  readonly ok: true;
  readonly fail: false;
  unwrap(): T;
}

export interface OptionFail extends IOption<unknown> {
  readonly error: Error;
  readonly code: number;
  readonly data: null;
  readonly ok: false;
  readonly fail: true;
  unwrap(): never;
}

export type Option<T> = OptionOk<T> | OptionFail;

export interface IOptional {
  ok<T>(result: T): OptionOk<T>;
  ok<T extends void>(): OptionOk<T>;

  fail(error: any): OptionFail;
  fail(msg: string, ...params: any[]): OptionFail;
  fail(error: any, ...params: any[]): OptionFail;
}

export const optional: IOptional = {
  ok<T>(result?: any) {
    const ok: OptionOk<T> = {
      data: result,
      error: null,
      code: null,
      fail: false,
      ok: true,
      unwrap: () => result,
    };
    return ok;
  },

  fail(reason: string) {
    const err = isError(reason) ? reason : new Error(String(reason));
    const fail: OptionFail = {
      data: null,
      error: err,
      code: (err as Error & { code?: number }).code || 500,
      fail: true,
      ok: false,
      unwrap: () => {
        throw err;
      },
    };
    return fail;
  },
};
