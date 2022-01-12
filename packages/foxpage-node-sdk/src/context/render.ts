import _ from 'lodash';

import { ContextInstance, Logger } from '@foxpage/foxpage-shared';
import {
  FoxpageComponent,
  FoxpageHooks,
  FrameworkResource,
  Package,
  RenderAppInfo,
  RenderOption,
  StructureNode,
  Tag,
} from '@foxpage/foxpage-types';

import { frameworkResources } from '../common';
import { loggerCreate } from '../logger';

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
  componentMap = new Map<string, FoxpageComponent>();
  structureMap = new Map<
    string,
    Pick<StructureNode, 'id' | 'name' | 'version' | 'props'> & { childrenIds: string[] }
  >();

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
    this.plugins = app.pluginManager?.getPlugins() || [];
    // init get hook proxy
    this.getHooks = () => app.pluginManager?.getHooks();

    this.logger = loggerCreate('render process');
  }

  get hooks() {
    return (this.getHooks() || []) as FoxpageHooks;
  }
}
