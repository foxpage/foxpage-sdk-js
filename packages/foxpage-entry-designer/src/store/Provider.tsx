import React from 'react';

import { StoreContext, StoryContextType } from './context';
import { StoreType } from './interface';

const StoreProvider: React.FC<{ store: StoreType; children: React.ReactNode }> = ({ children, store }) => {
  const storeContextValue: StoryContextType = {
    store,
  };
  return <StoreContext.Provider value={storeContextValue}>{children}</StoreContext.Provider>;
};

export default StoreProvider;
