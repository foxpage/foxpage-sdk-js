import { isMatchByExtend, isMatchById, isMatchByName, MergeStrategy } from './../type';
import { matchByExtend } from './extend';
import { matchById } from './id';
import { matchByName } from './name';

export const matcherCreator = (strategy: MergeStrategy = MergeStrategy.COMBINE) => {
  if (isMatchByExtend(strategy)) {
    return matchByExtend;
  } else if (isMatchById(strategy)) {
    return matchById;
  } else if (isMatchByName(strategy)) {
    return matchByName;
  }
};
