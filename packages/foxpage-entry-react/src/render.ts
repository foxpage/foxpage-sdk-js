import { FunctionComponentElement } from 'react';
import ReactDOM from 'react-dom';

import { StructureLoader } from './loaders/structure';
import { MOUNT_POINT_ID } from './constant';
import { InitialState } from './interface';

const getRenderMethod = (): 'render' | 'hydrate' => {
  const mount = document.getElementById(MOUNT_POINT_ID);
  const hasServerRendered = mount && mount.innerHTML.replace(/^\s+/, '') !== '';
  return hasServerRendered ? 'hydrate' : 'render';
};

export const render = (
  element: FunctionComponentElement<{
    initialState: InitialState;
  }>,
  structureLoader: StructureLoader,
  initialState: InitialState,
) => {
  const container = document.getElementById(MOUNT_POINT_ID);
  const renderMethod =
    initialState.option.renderMethod || (structureLoader.errors.length ? 'render' : getRenderMethod());
  ReactDOM[renderMethod](element, container);
};
