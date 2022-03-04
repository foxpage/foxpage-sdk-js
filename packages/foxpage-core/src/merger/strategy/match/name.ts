import { MergeStructureNode } from '../../interface';

/**
 * match the node by name, match all
 * @param record
 * @param list
 * @param mergeNode
 */
export const matchByName = <T extends MergeStructureNode>(
  record: Record<string, T>,
  list: T[],
  mergeNode: (base: T, current: T) => T,
) => {
  // get the record with key is name
  // for get the value easy
  const namesRecord: Record<string, T[]> = {};
  Object.values(record).forEach(item => {
    if (!namesRecord[item.name]) {
      namesRecord[item.name] = [];
    }
    namesRecord[item.name].push(item);
  });

  list.forEach(item => {
    const baseNodes = namesRecord[item.name];
    if (baseNodes) {
      baseNodes.forEach(node => {
        const merged = mergeNode(node, item);
        record[node.id] = { ...merged, childIds: node.childIds };
      });
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
