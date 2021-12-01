import { AppContext, Application } from '@foxpage/foxpage-types';

export class AppContextImpl implements AppContext {
  /**
   * application id
   *
   * @type {string}
   */
  readonly appId: string;
  /**
   * application slug
   *
   * @type {string}
   */
  readonly slug: string;
  /**
   * current application
   *
   * @type {Application}
   */
  app: Application;

  constructor(app: Application) {
    this.appId = app.appId;
    this.slug = app.slug;
    this.app = app;
  }

  public get tags() {
    return this.app.tagManager;
  }

  public get pages() {
    return this.app.pageManager;
  }
  public get packages() {
    return this.app.packageManager;
  }

  public get variables() {
    return this.app.variableManager;
  }

  public get conditions() {
    return this.app.conditionManager;
  }

  public get templates() {
    return this.app.templateManager;
  }

  public get functions() {
    return this.app.functionManager;
  }
}
