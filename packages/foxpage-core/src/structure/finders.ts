import { Context, StructureNode } from '@foxpage/foxpage-types';

type DSL = Context['page']['schemas'];

const createSelector =
  <K extends keyof StructureNode>(key: K, val: StructureNode[K]) =>
  (structure?: StructureNode) => {
    return structure && structure[key] === val;
  };

export const findStructureByName = (dsl: DSL, value: string) => {
  const selector = createSelector('name', value);
  return findStructure(dsl, selector);
};

export const findStructureById = (dsl: DSL, value: string) => {
  const selector = createSelector('id', value);
  return findStructure(dsl, selector);
};

export const findStructure = (
  list: DSL,
  selector: (structure?: StructureNode<any> | undefined) => boolean | undefined,
): StructureNode | null => {
  for (let idx = 0; idx < list.length; idx++) {
    const node = list[idx];
    if (selector(node)) {
      return node;
    }
    if (node.children?.length) {
      const result = findStructure(node.children, selector);
      if (result) {
        return result;
      }
    }
  }
  return null;
};
