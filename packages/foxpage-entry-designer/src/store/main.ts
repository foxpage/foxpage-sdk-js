import { createStoreHooks } from './hooks';
import { createStore } from './store';

export interface PageStore {}

// store
export const store = createStore<PageStore>();

if (typeof window !== 'undefined') {
  window.__FOXPAGE_STORE__ = store;
}

const { useStoreState } = createStoreHooks(store);
export { useStoreState };
