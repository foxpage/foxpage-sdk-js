import { Condition } from './condition';
import { DSLStructure } from './dsl';
import { VariableBase } from './variable';

export interface PageDSL {
  // content
  variables?: Array<VariableBase>;
  conditions?: Condition[];
  structures: DSLStructure[];

  // info
  id: string;
  name?: string;
  versionNumber: number; // DSL 的版本
  md5: string;

  // locale
  language?: string;
  country?: string;
  locale: string;

  // extend
  pageId?: string;
  appId?: string;
  type?: number;
}
