import { Application } from "../application";
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
} from "../manager";
import { StructureNode } from '../structure';

export interface ContentVersion<T> {
  id: string;
  schemas: T[];
  relation?: Relation;
}

export interface ContentDetail<T = StructureNode | VariableItem | ConditionItem | FPFunctionItem> extends ContentVersion<T> {
  relationMap?: Map<string, string[]>;
  // getters
  templates?: string[];
  variables?: string[];
  sysVariables?: string[];
  functions?: string[];
  conditions?: string[];
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
}


export type RenderAppInfo = Pick<Application, 'appId' | 'slug' | 'configs'> & { pluginManager?: Application['pluginManager'] };

export interface ContentRelationInfo {
  content: ContentDetail;
  relations: ContentInfo;
}
