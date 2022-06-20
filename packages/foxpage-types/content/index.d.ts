import { Application } from '../application';
import {
  Condition,
  FPFunction,
  Page,
  Relation,
  Tag,
  Template,
  Variable,
  ConditionItem,
  FPFunctionItem,
  VariableItem,
  FPFile,
  Mock,
  MockItem,
} from '../manager';
import { StructureNode } from '../structure';

export interface ContentExtension {
  extendId?: string;
  mockId?: string;
}

export interface ContentVersion<T> {
  id: string;
  schemas: T[];
  relation?: Relation;
  extension?: ContentExtension;
  version?: string;
  versionNumber?: number;
  name?: string;
  fileId?: string;
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
}

export type RenderAppInfo = Pick<Application, 'appId' | 'slug' | 'configs'> & {
  pluginManager?: Application['pluginManager'];
};

export interface ContentRelationInfo {
  content: ContentDetail;
  relations: ContentInfo;
  mock?: Mock;
}
