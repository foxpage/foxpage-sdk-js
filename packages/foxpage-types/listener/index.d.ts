// listener
export interface ComponentActionBase {
  id: string;
}

export interface ComponentActionCallComponent extends ComponentActionBase {
  type: 'action.component.call';
  children: Array<{ id: string; type: string; props: { [key: string]: any } }>;
}

export type ComponentAction = ComponentActionCallComponent;

export type ComponentListeners = Record<string, ComponentAction[]>;
