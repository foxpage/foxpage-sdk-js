import { isArray } from '../helper';

import { StoreType } from './interface';

type StoreValueType = Record<string, any>;

type StoreConsumer<V extends any = any> = (newValue: V) => void;

export function createStore<S extends StoreValueType = StoreValueType>(defaultState: S = {} as any) {
  const state: S = { ...defaultState };
  const stateConsumers: Partial<Record<keyof S, StoreConsumer[]>> = {};
  const callConsumers = (namespace: string, newValues: StoreValueType) => {
    const consumers = stateConsumers[namespace];
    if (consumers) {
      consumers.forEach(c => c(newValues));
    }
  };

  const store: StoreType = {
    get consumers() {
      return stateConsumers;
    },
    get state() {
      return state;
    },
    getState<K extends keyof S>(namespace: K, initValue?: S[K]) {
      if (namespace in state) {
        return state[namespace];
      }
      if (typeof initValue !== 'undefined') {
        state[namespace] = initValue;
        return initValue;
      }
      return;
    },
    dispatch<K extends keyof S>(targetNamespace: K, updated: S[K]) {
      state[targetNamespace] = updated;
      callConsumers(targetNamespace as string, updated);
    },
    subscribe<K extends keyof S>(namespace: K, consumer: StoreConsumer<S[K]>) {
      if (!isArray(stateConsumers[namespace])) {
        stateConsumers[namespace] = [];
      }
      (stateConsumers[namespace] as any[]).push(consumer);
    },
    unsubscribe<K extends keyof S>(namespace: K, consumer: StoreConsumer<S[K]>) {
      const consumers = stateConsumers[namespace];
      if (consumers) {
        const idx = consumers.indexOf(consumer);
        if (idx > -1) {
          consumers.splice(idx, 1);
        }
      }
    },
  };

  return store;
}
