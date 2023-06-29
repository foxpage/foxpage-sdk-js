import { ComponentAction, ComponentActionCallComponent } from '@foxpage/foxpage-types';

export type ComponentActionMap = {
  'action.component.call': ComponentActionCallComponent;
};

export type Fn = {
  (...args: any[]): any;
};

export type ActionTransformer<A extends ComponentAction = ComponentAction> = (action: A) => Fn;
