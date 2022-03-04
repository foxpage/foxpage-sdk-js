import { MergeStructureNode } from '../interface';

import { matcherCreator } from './match';
import { mergerCreator } from './merge';
import { MergeStrategy } from './type';

export const strategyMerge = <T extends MergeStructureNode>(
  record: Record<string, T>,
  list: T[],
  strategy: MergeStrategy = MergeStrategy.COMBINE,
) => {
  const matcher = matcherCreator(strategy);
  if (typeof matcher === 'function') {
    const merger = mergerCreator(strategy);
    if (typeof merger === 'function') {
      matcher(record, list, merger);
    }
  }
};
