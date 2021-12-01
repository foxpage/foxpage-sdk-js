import { ComponentActionCallComponent } from '@foxpage/foxpage-types';

import { updateStructureProps } from '../store';
import { ActionTransformer } from '../types';

const transformer: ActionTransformer<ComponentActionCallComponent> = action => {
  const { children } = action;
  const callback = (...args: any[]) => {
    children?.forEach((child: any) => {
      updateStructureProps(child, getTargetComponentProps(child, args));
    });
  };

  return callback;
};

export default transformer;

function getTargetComponentProps(desc: ComponentActionCallComponent['children'][0], _args: any[]) {
  return desc?.props;
}
