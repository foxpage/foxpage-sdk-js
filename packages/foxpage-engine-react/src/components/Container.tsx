import React from 'react';

import { Context } from '@foxpage/foxpage-types';

export interface ContainerProps {
  ctx: Context;
}

export const Container: React.FC<ContainerProps> = ({ children }) => {
  return <React.Fragment>{children}</React.Fragment>;
};
