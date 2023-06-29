import React from 'react';

import { StoreType, StoreValueType } from './interface';

export const createStoreHooks = <State extends StoreValueType = StoreValueType>(store: StoreType<State>) => {
  return {
    useStoreState: <K extends keyof State>(namespace: K, initValue?: State[K]) => {
      const [storeState, setStoreState] = React.useState<any>(() => store.getState(namespace, initValue));
      React.useEffect(() => {
        store.subscribe(namespace, setStoreState);
        return () => store.unsubscribe(namespace, setStoreState);
      });
      return storeState;
    },
  };
};
