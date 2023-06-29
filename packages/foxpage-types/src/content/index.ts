import { Application } from '../application';
import {
  Block,
  Condition,
  ConditionItem,
  FPFile,
  FPFunction,
  FPFunctionItem,
  Mock,
  MockItem,
  Page,
  Relation,
  Tag,
  Template,
  Variable,
  VariableItem,
} from '../manager';
import { StructureNode } from '../structure';

export interface ContentExtension {
  extendId?: string;
  mockId?: string;
}

export type ContentVersionType = 'page' | 'template' | 'variable' | 'condition' | 'function' | 'block' | 'mock';

export interface ContentVersion<T> {
  id: string;
  schemas: T[];
  relation?: Relation;
  extension?: ContentExtension;
  version?: string;
  versionNumber?: number;
  name?: string;
  fileId?: string;
  type: ContentVersionType;
}

export interface ContentDetail<T = StructureNode | VariableItem | ConditionItem | FPFunctionItem | MockItem>
  extends ContentVersion<T> {
  relationMap?: Map<string, string[]>;
  // getters
  templates?: string[];
  variables?: string[];
  sysVariables?: string[];
  functions?: string[];
  conditions?: string[];
  mocks?: string[];
  blocks?: string[];
}

export interface Content {
  id: string;
  tags: Tag[];
  fileId: string;
  title: string;
  createTime: string;
}

export interface ContentInfo {
  pages?: Page[];
  templates?: Template[];
  variables?: Variable[];
  functions?: FPFunction[];
  conditions?: Condition[];
  files?: FPFile[];
  mocks?: Mock[];
  blocks?: Block[];
}

export type RenderAppInfo = Pick<Application, 'appId' | 'slug' | 'configs'> & {
  pluginManager?: Application['pluginManager'];
};

export interface ContentRelationInfo {
  content: ContentDetail;
  relations: ContentInfo;
  mock?: Mock;
}
