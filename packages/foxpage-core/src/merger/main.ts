import { isNotNill } from '@foxpage/foxpage-shared';
import { Page } from '@foxpage/foxpage-types';

import { MergeStructureNode } from './interface';
import { MergeStrategy, strategyMerge } from './strategy';
import { mergeObject } from './utils';

/**
 * tree to record
 * for get extend parent node easy
 * @param tree tree data
 * @returns
 */
export const preMerge = <T extends MergeStructureNode>(trees: T[]) => {
  const record: Record<string, T> = {};

  function dfs(tree: T[], parentId: string) {
    tree.forEach(item => {
      record[item.id] = {
        ...item,
        extension: { ...item.extension, parentId },
        children: [],
        childIds: item.children?.map(item => item.id),
      };
      if (item.children?.length) {
        dfs(item.children as T[], item.id);
      }
    });
  }

  dfs(trees, '');
  return record;
};

/**
 * record to tree
 * @param records structure node records
 * @returns new tree
 */
export const postMerge = <T extends MergeStructureNode>(record: Record<string, T>) => {
  const roots: T[] = [];

  Object.keys(record).forEach(key => {
    const node = record[key];
    const { parentId } = node.extension || {};
    if (parentId) {
      // the invalid node
      // be care for use it
      if (!record[parentId]) {
        roots.push(node);
      }
    } else {
      roots.push(node);
    }
  });

  function dfs(list: T[]) {
    list.forEach(item => {
      const childIds = item.childIds || [];
      if (childIds.length > 0) {
        const children = childIds
          ?.map(id => record[id])
          .filter(isNotNill)
          .sort((one, two) => (one.extension?.sort || 0) - (two.extension?.sort || 0));
        item.children = children.length > 0 ? dfs(children) : [];
      }
      // avoid the extension data
      delete item.childIds;
    });
    return list;
  }

  const tree: T[] = dfs(roots);
  return tree;
};

/**
 * handle merge
 *
 * preMerge:transform the default schemas to record for get easy
 * doMerge: merge every node
 * postMerge:collect the merged node & transform to the tree(page structure)
 *
 * @param base base page content
 * @param current current page content
 * @param options merge options
 * @returns merge page content
 */
export const merge = (base: Page, current: Page, options = { strategy: MergeStrategy.COMBINE }) => {
  const baseRecord = preMerge(base.schemas);

  strategyMerge(baseRecord, current.schemas, options.strategy);

  const newSchemas = postMerge(baseRecord);

  const result: Page = {
    ...current,
    schemas: newSchemas,
    relation: mergeObject(base.relation || {}, current.relation || {}),
  };
  return result;
};
