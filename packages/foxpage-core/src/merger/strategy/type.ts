/**
 * merge strategy
 */
export enum MergeStrategy {
  /**
   * replace
   * default equals REPLACE_BY_ID
   */
  REPLACE = 1,
  /**
   * matched by id then replace
   */
  REPLACE_BY_ID = 2,
  /**
   * matched by name then replace
   */
  REPLACE_BY_NAME = 3,
  /**
   * combine
   * default equals COMBINE_BY_ID
   */
  COMBINE = 10,
  /**
   * matched by id then combine
   */
  COMBINE_BY_ID = 11,
  /**
   * matched by name then combine
   */
  COMBINE_BY_NAME = 12,
  /**
   * matched by extend(inherit) the combine
   */
  COMBINE_BY_EXTEND = 13,
  // /**
  //  * matched by position then combine
  //  */
  // COMBINE_BY_POSITION = 14,
}

// match
export const MATCH_BY_ID = [
  MergeStrategy.COMBINE,
  MergeStrategy.COMBINE_BY_ID,
  MergeStrategy.REPLACE,
  MergeStrategy.REPLACE_BY_ID,
];
export const MATCH_BY_NAME = [MergeStrategy.COMBINE_BY_NAME, MergeStrategy.REPLACE_BY_NAME];
export const MATCH_BY_EXTEND = [MergeStrategy.COMBINE_BY_EXTEND];

// merge
export const REPLACE_STRATEGY = [MergeStrategy.REPLACE, MergeStrategy.REPLACE_BY_ID, MergeStrategy.REPLACE_BY_NAME];
export const COMBINE_STRATEGY = [
  MergeStrategy.COMBINE,
  MergeStrategy.COMBINE_BY_ID,
  MergeStrategy.COMBINE_BY_NAME,
  MergeStrategy.COMBINE_BY_EXTEND,
];

// match
export const isMatchById = (strategy: MergeStrategy) => {
  return MATCH_BY_ID.indexOf(strategy) > -1;
};
export const isMatchByName = (strategy: MergeStrategy) => {
  return MATCH_BY_NAME.indexOf(strategy) > -1;
};
export const isMatchByExtend = (strategy: MergeStrategy) => {
  return MATCH_BY_EXTEND.indexOf(strategy) > -1;
};

// merge
export const isReplace = (strategy: MergeStrategy) => {
  return REPLACE_STRATEGY.indexOf(strategy) > -1;
};
export const isCombine = (strategy: MergeStrategy) => {
  return COMBINE_STRATEGY.indexOf(strategy) > -1;
};
