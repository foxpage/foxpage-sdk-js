import { Template, Variable, Condition, FPFunction } from './index';
import { ContentInfo } from '../content';

export type RelationTypes = 'sys-variable' | 'variable' | 'condition' | 'template' | 'function';

export interface Relation {
  [k: string]: {
    id: string;
    type: RelationTypes;
    [k: string]: unknown;
  }
}

export interface RelationInfo extends Pick<ContentInfo, 'templates' | 'variables' | 'conditions' | 'functions'> {
  sysVariables?: string[];
}
