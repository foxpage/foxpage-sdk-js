import { ComponentAction } from '@foxpage/foxpage-types';

import { isArray } from '../helper';

import { ActionTransformer, ComponentActionMap, Fn } from './types';

const actionTransformerMap: Record<string, ActionTransformer> = {};

export function registerComponentActionTransformer<T extends keyof ComponentActionMap>(
  actionType: T,
  fn: ActionTransformer<ComponentActionMap[T]>,
): void;
export function registerComponentActionTransformer(actionType: string, fn: ActionTransformer): void;
export function registerComponentActionTransformer(actionType: string, fn: ActionTransformer): void {
  actionTransformerMap[actionType] = fn;
}

export function transformComponentAction(action?: ComponentAction): Fn {
  let callback: Fn = () => {};

  if (action && action.type) {
    const { type } = action;
    const transformer = actionTransformerMap[type];

    if (typeof transformer === 'function') {
      callback = transformer(action);
    }
  }

  return callback;
}

export function transformComponentActions(actions?: ComponentAction[]): Fn {
  if (!actions) {
    return () => {};
  }
  if (!isArray(actions)) {
    return () => {};
  }
  const fns = actions.map(transformComponentAction);
  return (...args: any[]) => {
    console.debug('call action', args, actions);
    fns.forEach(fn => fn.call(null, args));
  };
}

// register defaults
registerComponentActionTransformer(
  'action.component.call',
  (require('./transformer/component_call') as typeof import('./transformer/component_call')).default,
);
