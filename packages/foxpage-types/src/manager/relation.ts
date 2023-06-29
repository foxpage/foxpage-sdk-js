import { ContentInfo } from '../content';

export type RelationTypes = 'sys_variable' | 'variable' | 'condition' | 'template' | 'function' | 'block';

export interface Relation {
  [k: string]: {
    id: string;
    type: RelationTypes;
    [k: string]: unknown;
  };
}

export interface RelationInfo
  extends Pick<ContentInfo, 'templates' | 'variables' | 'conditions' | 'functions' | 'mocks' | 'blocks'> {
  sysVariables?: string[];
}
