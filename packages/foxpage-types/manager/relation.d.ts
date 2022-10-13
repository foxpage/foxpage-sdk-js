import { Template, Variable, Condition, FPFunction } from './index';
import { ContentInfo } from '../content';
import { Page } from '../manager';

export type RelationTypes = 'sys_variable' | 'variable' | 'condition' | 'template' | 'function';

export interface Relation {
  [k: string]: {
    id: string;
    type: RelationTypes;
    [k: string]: unknown;
  }
}

export interface RelationInfo extends Pick<ContentInfo, 'templates' | 'variables' | 'conditions' | 'functions' | 'mocks'> {
  sysVariables?: string[];
}
