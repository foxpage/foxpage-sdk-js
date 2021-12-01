import { Messages, Option, optional } from '@foxpage/foxpage-shared';
import { PackageSource } from '@foxpage/foxpage-types';

import { fetchPackage } from './fetch-service';

/**
 * fetch result
 *
 * @export
 * @interface FetchResult
 */
export interface FetchResult {
  content: string;
}

/**
 * package fetch option
 *
 * @export
 * @interface PackageFetcherOption
 */
export interface PackageFetcherOption {
  maxRetryTime?: number;
  downloadTimeout?: number;
}

/**
 * package fetcher
 *
 * @export
 * @class PackageFetcher
 */
export class PackageFetcher {
  /**
   * retry times
   *
   * @type {number}
   */
  retryCount: number;
  /**
   * fetch result
   *
   * @type {FetchResult}
   */
  result?: FetchResult | undefined;
  /**
   * package resource
   *
   * @type {PackageSource}
   */
  readonly resource: PackageSource;
  /**
   * messages for package fetcher
   *
   * @type {Messages}
   */
  readonly messages: Messages;
  readonly option: PackageFetcherOption & Required<Pick<PackageFetcherOption, 'maxRetryTime'>>;

  constructor(source: PackageSource, option: PackageFetcherOption = {}) {
    this.resource = source;
    this.option = {
      maxRetryTime: 5,
      ...option,
    };
    this.retryCount = 1;
    this.messages = new Messages();
  }

  /**
   * fetch package code
   *
   * @return {*}  {Promise<Option<FetchResult>>}
   */
  public async fetch(): Promise<Option<FetchResult>> {
    if (this.retryCount > this.option.maxRetryTime) {
      return optional.fail(this.messages.stringify());
    }

    if (this.result) {
      return optional.ok(this.result);
    }

    const res = await fetchPackage(this.resource, {
      timeout: this.option.downloadTimeout,
    });

    if (res.ok) {
      this.result = res.data;
      return res;
    }

    this.messages.push(res.error);

    this.retryCount += 1;
    return this.fetch();
  }
}
