import { StructureNode } from '@foxpage/foxpage-types';

export const findOne = (structures: StructureNode<any>[], id: string) => {
  let node: StructureNode<any> | null = null;

  function deepSearch(list: StructureNode<any>[]) {
    for (let index = 0; index < list.length; index++) {
      const element = list[index];
      if (element.id === id) {
        node = element;
        break;
      }
    }
  }

  deepSearch(structures);

  return node;
};
