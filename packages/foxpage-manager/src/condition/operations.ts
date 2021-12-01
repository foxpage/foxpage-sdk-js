/**
 * condition expression operations
 *
 * @export
 * @enum {number}
 */
export enum ExpressionOperation {
  /**
   * less than
   */
  LESS_THAN = 'lt',
  /**
   * less than or equal to
   */
  LESSEQUALS = 'lt_eq',
  /**
   * greater than
   */
  GREATER_THAN = 'gt',
  /**
   * greater than or equal to
   */
  GREATEREQUALS = 'gt_eq',
  /**
   * equals
   */
  EQUALS = 'eq',
  /**
   * contains
   */
  CONTAINS = 'ct',
  /**
   * in array
   */
  INARRAY = 'in_array',
  /**
   * start with
   */
  STARTS_WITH = 'sw',
  /**
   * end with
   */
  ENDS_WITH = 'ew',
  /**
   * matches RegEx
   */
  REGEX = 'regex',
  /**
   * matches RegEx(ignore case)
   */
  REGEXIGNORECASE = 'regex_uncase',
  /**
   * does not equal
   */
  NOTEQUALS = 'un_eq',
  /**
   * does not contain
   */
  NOTCONTAINS = 'un_ct',
  /**
   * not in array
   */
  NOTINARRAY = 'un_in_array',
  /**
   * does not start with
   */
  NOTSTARTSWITH = 'un_sw',
  /**
   * does not end with
   */
  NOTENDSWITH = 'un_ew',
  /**
   * does not matches RegEx
   */
  NOTREGEX = 'un_regex',
  /**
   * 	does not matches RegEx(ignore case)
   */
  NOTREGEXIGNORECASE = 'un_regex_uncase',
}
