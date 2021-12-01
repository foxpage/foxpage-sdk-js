/**
 * foxpage plugin
 *
 * @export
 * @interface FoxpagePlugin
 * @template T
 */
export interface FoxpagePlugin<T = Record<string, any>> {
  /**
   * plugin key
   * empty will use the package name
   *
   * @type {string}
   */
  name?: string;
  /**
   * visitor
   * hook implement
   * @type {T}
   */
  visitor: T;
  /**
   * options
   *
   * @type {Record<string, any>}
   */
  options?: Record<string, any>;
}
