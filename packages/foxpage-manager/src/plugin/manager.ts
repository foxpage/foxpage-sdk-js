import { Mode } from '@foxpage/foxpage-plugin';
import { createPluginLoader, PluginLoader, PluginLoaderOptions } from '@foxpage/foxpage-plugin';
import { createLogger } from '@foxpage/foxpage-shared';
import { FoxpageHooks, Logger, PluginManager } from '@foxpage/foxpage-types';

/**
 * plugin manager
 *
 * @export
 * @class PluginManagerImpl
 * @implements {PluginManager}
 */
export class PluginManagerImpl implements PluginManager {
  /**
   * plugin loader
   *
   * @private
   * @type {PluginLoader}
   */
  private loader: PluginLoader;
  public logger: Logger;

  constructor(opt: PluginLoaderOptions) {
    this.logger = createLogger('pluginManager');
    this.loader = createPluginLoader({
      baseDir: opt.baseDir || process.cwd(),
      plugins: opt.plugins,
      api: opt.api,
      mode: opt.mode,
    });
  }

  /**
   * load plugins
   *
   */
  public loadPlugins() {
    try {
      this.loader.load();
    } catch (e) {
      const msg = (e as Error).message;
      this.logger.error(msg);
      throw new Error(msg);
    }
  }

  /**
   * get one plugin
   *
   * @param {string} name
   * @return {*}
   */
  public getPlugin(name: string) {
    return this.loader.getPlugin(name);
  }

  /**
   * get plugins
   *
   * @return {*}
   */
  public getPlugins() {
    return this.loader.getList();
  }

  /**
   * getHooks
   */
  public getHooks(mode?: Mode) {
    return this.loader.getHooks(mode) as FoxpageHooks | undefined;
  }

  /**
   * check plugin
   *
   * @param {string} name
   * @return {*}
   */
  public hasPlugin(name: string) {
    return this.loader.hasPlugin(name);
  }

  /**
   * destroy
   */
  public destroy() {
    this.loader.destroy();
  }
}
