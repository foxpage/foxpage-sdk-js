import { RelationInfo } from '@foxpage/foxpage-types';

export const relationsMerge = (relation: RelationInfo, relations: RelationInfo) => {
  Object.keys(relation).forEach(key => {
    const keyStr = key as keyof RelationInfo;
    if (relation[keyStr]) {
      if (!relations[keyStr]) {
        relations[keyStr] = [];
      }
      // @ts-ignore
      relations[keyStr] = (relations[keyStr] || []).concat(relation[keyStr]);
    }
  });
  return relations;
};
