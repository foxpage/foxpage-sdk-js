import { MergeStructureNode } from '../../interface';

export const matchById = <T extends MergeStructureNode>(
  record: Record<string, T>,
  list: T[],
  mergeNode: (base: T, current: T) => T,
) => {
  list.forEach(item => {
    const baseNode = record[item.id];
    if (baseNode) {
      const merged = mergeNode(baseNode, item);
      record[item.id] = { ...merged, childIds: baseNode.childIds };
    } else {
      // collect the new nodes
      record[item.id] = item;
      const parentId = item.extension?.parentId || '';
      const parent = record[parentId];
      if (parent) {
        if (!parent.childIds) {
          parent.childIds = [];
        }
        parent.childIds.push(item.id);
      }
    }
  });
};
