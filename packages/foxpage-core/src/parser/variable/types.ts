/**
 * variable type enum
 *
 * @export
 * @enum {number}
 */
export enum VariableType {
  /**
   * system
   */
  DATA_SYS = 'data.sys',
  /**
   * static
   */
  DATA_STATIC = 'data.static',
  /**
   * proxy
   */
  DATA_PROXY = 'data.proxy',
  /**
   * function
   */
  DATA_FUNCTION = 'data.function',
  /**
   * function call
   */
  DATA_FUNCTION_CALL = 'data.function.call',
}
