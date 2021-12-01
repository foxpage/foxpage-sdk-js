import { StructureNode } from '@foxpage/foxpage-types';

import { store } from '../store';

export function generateStructurePropsStoreKey(node: Pick<StructureNode, 'id'>) {
  return `listener:${node.id}:props`;
}

export function getStructureProps(node: Pick<StructureNode, 'id'>) {
  return store.getState(generateStructurePropsStoreKey(node));
}

export function updateStructureProps(targetNode: Pick<StructureNode, 'id'>, props: Record<string, any>) {
  store.dispatch(generateStructurePropsStoreKey(targetNode), props);
}
