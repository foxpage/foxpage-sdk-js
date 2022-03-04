import { StructureNode } from '@foxpage/foxpage-types';

/**
 * replace structure node
 * @param base base node
 * @param current current node
 * @returns merged node
 */
export const replaceNode = (base: StructureNode, current: StructureNode) => {
  const newNode: StructureNode = { ...current, id: base.id, extension: base.extension };
  return newNode;
};
