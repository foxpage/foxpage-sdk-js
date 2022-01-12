import { PageDSL } from '../interface';

import { conditionsMerge } from './condition';
import { structureMerge } from './structure';
import { MergeOption, MergeStrategy } from './structure-merger';
import { variablesMerge } from './variable';

/**
 * merge dsl
 * @param staticDSL
 * @param dynamicDSL
 * @param opt
 */
const handleMerge = (staticDSL: PageDSL, dynamicDSL: PageDSL, opt: MergeOption) => {
  if (!staticDSL) {
    return dynamicDSL;
  }

  if (!dynamicDSL) {
    return staticDSL;
  }

  const {
    structures: staticStructures = [],
    variables: staticVariables = [],
    conditions: staticConditions = [],
    ...staticRest
  } = staticDSL;
  const {
    structures: dynamicStructures = [],
    variables: dynamicVariables = [],
    conditions: dynamicConditions = [],
    ...dynamicRest
  } = dynamicDSL;

  //structures merge
  const _structureMerged = structureMerge(staticStructures, dynamicStructures, opt);

  // variables merge
  const _variableMerged = variablesMerge(staticVariables, dynamicVariables);

  // conditions merge
  const _conditionMerged = conditionsMerge(staticConditions, dynamicConditions);

  return {
    ...staticRest,
    ...dynamicRest,
    structures: _structureMerged,
    conditions: _conditionMerged,
    variables: _variableMerged,
  } as PageDSL;
};

export const merge = (staticDSL: PageDSL, dynamicDSL: PageDSL, opt: MergeOption = {}) => {
  const _mergeStrategy = opt.mergeStrategy || MergeStrategy.combine; // default mergeStrategy is combine
  const result = handleMerge(staticDSL, dynamicDSL, { ...opt, mergeStrategy: _mergeStrategy });
  return result;
};

/**
 * replace dsl
 * @param staticDSL
 * @param dynamicDSL
 */
export const replace = (staticDSL: PageDSL, dynamicDSL: PageDSL, opt: MergeOption = {}) => {
  const result = handleMerge(staticDSL, dynamicDSL, { ...opt, mergeStrategy: MergeStrategy.replace });
  return result;
};

/**
 * replace all dsl
 * @param staticDSL
 * @param dynamicDSL
 */
export const replaceAll = (staticDSL: PageDSL, dynamicDSL: PageDSL, opt: MergeOption = {}) => {
  const result = handleMerge(staticDSL, dynamicDSL, { ...opt, mergeStrategy: MergeStrategy.replaceAll });
  return result;
};

/**
 * combine dsl
 * @param staticDSL
 * @param dynamicDSL
 */
export const combine = (staticDSL: PageDSL, dynamicDSL: PageDSL, opt: MergeOption = {}) => {
  const result = handleMerge(staticDSL, dynamicDSL, { ...opt, mergeStrategy: MergeStrategy.combine });
  return result;
};

/**
 * combine all dsl
 * @param staticDSL
 * @param dynamicDSL
 */
export const combineAll = (staticDSL: PageDSL, dynamicDSL: PageDSL, opt: MergeOption = {}) => {
  const result = handleMerge(staticDSL, dynamicDSL, { ...opt, mergeStrategy: MergeStrategy.combineAll });
  return result;
};
