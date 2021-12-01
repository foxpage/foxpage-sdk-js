import { ComponentListeners, StructureNode } from '@foxpage/foxpage-types';

import { mapObject } from '../helper/utils';
import { useStoreState } from '../store';

import { transformComponentActions } from './actions';
import { generateStructurePropsStoreKey } from './store';

export function transformListener(listeners?: ComponentListeners) {
  if (!listeners) {
    return {};
  }
  const handleProps: Record<string, (...args: any[]) => any> = mapObject(listeners, transformComponentActions);
  return handleProps;
}

export function useListenerConsumer(node: Pick<StructureNode, 'id'>) {
  return useStoreState(generateStructurePropsStoreKey(node));
}
