import _ from 'lodash';

import { ContextInstance, Logger } from '@foxpage/foxpage-shared';
import {
  FoxpageComponent,
  FoxpageHooks,
  FrameworkResource,
  Package,
  RenderAppInfo,
  RenderOption,
  Tag,
} from '@foxpage/foxpage-types';

import { createLogger, frameworkResources } from '../common';

/**
 * render context in node
 *
 * @export
 * @class RenderContextInstance
 * @extends {RenderContextBase}
 * @implements {Context}
 */
export class RenderContextInstance extends ContextInstance {
  tags: Tag[] = [];
  packages: Package[] = [];
  componentMap: Map<string, FoxpageComponent> = new Map<string, FoxpageComponent>();

  logger: Logger;

  options: RenderOption;

  frameworkResource: FrameworkResource;

  plugins: string[];
  private getHooks: () => FoxpageHooks | undefined;

  constructor(app: RenderAppInfo) {
    super(app);
    this.frameworkResource = frameworkResources;
    this.options = {
      renderMethod: 'hydrate',
    };
    this.plugins = app.pluginManager.getPlugins();
    // init get hook proxy
    this.getHooks = () => app.pluginManager.getHooks();

    this.logger = createLogger('render process');
  }

  get hooks() {
    return this.getHooks();
  }
}
