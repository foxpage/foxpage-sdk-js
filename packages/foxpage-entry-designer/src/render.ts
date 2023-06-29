import { FunctionComponentElement } from 'react';
import ReactDOM from 'react-dom';

import { MOUNT_POINT_ID } from './constant';
import { AppComponentProps, InitialState } from './interface';

export const render = (element: FunctionComponentElement<AppComponentProps>, _initialState: InitialState) => {
  let container = document.getElementById(MOUNT_POINT_ID);
  if (!container) {
    container = document.getElementsByTagName('body')[0];
  }

  const renderMethod = 'render';
  ReactDOM[renderMethod](element, container);
};
