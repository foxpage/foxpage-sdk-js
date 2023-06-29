import React from 'react';

import { StoreType } from './interface';

export interface StoryContextType {
  store: StoreType;
}

export const StoreContext = React.createContext<StoryContextType | null>(null);
