import { StructureMerger } from './structure-merger';

const createSelector =
  <T, K extends keyof T>(key: K, val: T[K]) =>
  (structure?: T) => {
    return structure && structure[key] === val;
  };

export const matchStructureById = <T extends StructureMerger>(structureNodes: T[] = [], id: T['id']) => {
  return structureNodes.find(createSelector<T, 'id'>('id', id));
};

export const matchAllStructureById = <T extends StructureMerger>(structureNodes: T[] = [], id: T['id']) => {
  return structureNodes.filter(createSelector<T, 'id'>('id', id));
};

export const matchStructureByType = <T extends StructureMerger>(structureNodes: T[] = [], type: T['type']) => {
  const selector = (predMergeNode: StructureMerger) =>
    predMergeNode.isPred() && createSelector<StructureMerger, 'type'>('type', type)(predMergeNode);

  return structureNodes.find(selector);
};

export const matchAllStructureByType = <T extends StructureMerger>(structureNodes: T[] = [], type: T['type']) => {
  return structureNodes.filter(createSelector<StructureMerger, 'type'>('type', type));
};
