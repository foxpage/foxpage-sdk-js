import { isCombine, isReplace, MergeStrategy } from './../type';
import { combineNode } from './combine';
import { replaceNode } from './replace';

export const mergerCreator = (strategy: MergeStrategy = MergeStrategy.COMBINE) => {
  if (isCombine(strategy)) {
    return combineNode;
  } else if (isReplace(strategy)) {
    return replaceNode;
  }
};
