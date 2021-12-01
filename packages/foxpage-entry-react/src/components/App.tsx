import React from 'react';

import { InitialState } from '../interface';

export const App: React.FC<{ initialState: InitialState }> = ({ children }) => {
  return <React.Fragment>{children}</React.Fragment>;
};
