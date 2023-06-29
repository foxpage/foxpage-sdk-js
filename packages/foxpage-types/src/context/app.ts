import { Application } from '../application';
import {
  ConditionManager,
  FunctionManager,
  PackageManager,
  PageManager,
  TagManager,
  TemplateManager,
  VariableManager,
} from '../manager';

/**
 * application context
 *
 * @export
 * @interface AppContext
 */
export interface AppContext {
  // base
  readonly appId: string;
  readonly slug: string;
  app: Application;

  // getters
  tags: TagManager;
  pages: PageManager;
  packages: PackageManager;
  variables: VariableManager;
  conditions: ConditionManager;
  templates: TemplateManager;
  functions: FunctionManager;

  // hooks

  // plugins
}
