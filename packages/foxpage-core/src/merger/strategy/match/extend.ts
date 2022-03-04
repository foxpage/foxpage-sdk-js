import { MergeStructureNode } from '../../interface';

export const matchByExtend = <T extends MergeStructureNode>(
  record: Record<string, T>,
  list: T[],
  mergeNode: (base: T, current: T) => T,
) => {
  list.forEach(item => {
    const { extendId } = item.extension || {};
    if (extendId) {
      const baseNode = record[extendId];
      // no parent will hide the node
      if (baseNode) {
        const merged = mergeNode(baseNode, item);
        if (merged) {
          record[extendId] = { ...merged, childIds: baseNode.childIds } as T;
        }
      }
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
