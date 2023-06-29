import { IncomingHttpHeaders, IncomingMessage } from 'http';
import { ParsedUrlQuery } from 'querystring';
import { URL } from 'url';

import Cookies from 'cookies';

import { Context } from '../context';

/**
 * request handle option
 * contains user request data
 *
 * @export
 * @interface FoxpageDelegatedRequest
 */
export interface FoxpageDelegatedRequest {
  /**
   * Return request header, alias as request.header
   */
  headers: IncomingHttpHeaders;

  /**
   * Get/Set request URL.
   */
  url: string;

  /**
   * Get origin of URL.
   */
  origin: string;

  /**
   * Get full request URL.
   */
  href: string;

  /**
   * Get/Set request method.
   */
  method: string;

  /**
   * Get request pathname.
   * Set pathname, retaining the query-string when present.
   */
  path: string;

  /**
   * Get parsed query-string.
   * Set query-string as an object.
   */
  query: ParsedUrlQuery;

  /**
   * Get/Set query string.
   */
  querystring: string;

  /**
   * Get the search string. Same as the querystring
   * except it includes the leading ?.
   *
   * Set the search string. Same as
   * response.querystring= but included for ubiquity.
   */
  search: string;

  /**
   * Parse the "Host" header field host
   * and support X-Forwarded-Host when a
   * proxy is enabled.
   */
  host: string;

  /**
   * Parse the "Host" header field hostname
   * and support X-Forwarded-Host when a
   * proxy is enabled.
   */
  hostname: string;

  /**
   * Get WHATWG parsed URL object.
   */
  URL: URL;
  req: IncomingMessage;
}

/**
 * foxpage delegate res
 */
export interface FoxpageDelegatedResponse {}

/**
 * foxpage delegate cookies
 */
export interface FoxpageDelegatedCookie extends Cookies {}

/**
 * foxpage request options
 * contains request info : req,res,cookies
 */
export interface FoxpageRequestOptions {
  request: FoxpageDelegatedRequest;
  response: FoxpageDelegatedResponse;
  cookies: FoxpageDelegatedCookie;
  ctx?: Context;
  mode?: {
    isMock?: boolean;
    isPreview?: boolean;
    isDebug?: boolean;
    isCanary?: boolean;
  };
}

export interface RequestMode {
  isDebugMode?: boolean;
  isPreviewMode?: boolean;
  isMock?: boolean;
  isCanary?: boolean;
  isFetchLatestMode?: boolean;
  isPerformanceMode?: boolean;
  isPreviewWithMark?: boolean;
}
