import { join } from 'path';

import fs from 'fs-extra';
import resolve from 'resolve';

import { FoxpageHooks } from './../../foxpage-types/hook/index.d';
import { FoxpagePlugin, PluginLoader, PluginLoaderOptions } from './interfaces';
import { Mode } from './mode';

export type FoxpagePluginVisitor = FoxpagePlugin<Record<string, Array<any>>>['visitor'];

/**
 * plugin loader impl
 *
 * @export
 * @class PluginLoaderImpl
 * @implements {PluginLoader}
 */
export class PluginLoaderImpl implements PluginLoader {
  baseDir: string;
  api: PluginLoaderOptions['api'];
  // plugin names
  list: string[];

  visitors: FoxpagePluginVisitor = {};

  mode = Mode.PIPE;

  private readonly pluginDir: string;
  private readonly pluginMap: Map<string, FoxpagePlugin> = new Map();

  constructor(opt: PluginLoaderOptions) {
    this.baseDir = opt.baseDir;
    this.pluginDir = join(this.baseDir, 'node_modules/');
    this.list = Array.from(new Set(opt.plugins)) || [];
    this.api = opt.api;
    if (opt.mode) {
      this.mode = opt.mode;
    }
  }

  /**
   * get plugin entry
   *
   * @private
   * @param {string} name
   * @return {string}
   */
  private resolvePlugin(name: string) {
    try {
      return resolve.sync(name, { basedir: this.baseDir });
    } catch (err) {
      return join(this.baseDir, 'node_modules', name);
    }
  }

  /**
   * load plugins
   *
   */
  public load() {
    if (!fs.existsSync(this.pluginDir)) {
      return null;
    }

    const emptyList: string[] = [];
    const modules: string[] = [];
    this.list.forEach((name: string) => {
      const path = this.resolvePlugin(name);
      if (fs.existsSync(path)) {
        modules.push(name);
      } else {
        emptyList.push(name);
      }
    });

    if (emptyList.length > 0) {
      throw new Error(`plugins [ ${emptyList.toString()} ] not found.`);
    }

    for (const module of modules) {
      this.registerPlugin(module);
    }

    return this.mergeVisitors();
  }

  /**
   * register a plugin
   *
   * @param {string} name
   * @return {*}
   */
  public registerPlugin(name: string) {
    try {
      const plugin = this.getPlugin(name);
      if (!plugin || !plugin.visitor) {
        throw new Error(`plugin [ ${name} ] is invalid`);
      }

      this.pluginMap.set(name, { ...plugin, name });
    } catch (e) {
      throw new Error(`plugin [ ${name} ] load failed:` + (e as Error).message);
    }
  }

  /**
   * unregister a plugin
   *
   * @param {string} name
   * @memberof PluginLoaderImpl
   */
  public unregisterPlugin(name: string) {
    this.pluginMap.delete(name);
    this.list = this.list.filter(item => item !== name);
  }

  /**
   * get a plugin
   *
   * @param {string} name
   * @return {*}
   */
  public getPlugin(name: string) {
    if (this.hasPlugin(name)) {
      return this.pluginMap.get(name);
    }

    // all plugin must export default
    const plugin = require(this.pluginDir + name).default({ api: this.api }) as FoxpagePlugin;
    return plugin;
  }

  /**
   * get all plugin name list
   *
   * @return {string[]}
   */
  public getList() {
    return Array.from(this.pluginMap.keys());
  }

  /**
   * check if exist the plugin
   *
   * @param {string} name
   * @return {boolean}
   */
  public hasPlugin(name: string) {
    return !!this.pluginMap.has(name);
  }

  /**
   * merge visitors
   */
  public mergeVisitors() {
    this.list.forEach(item => {
      const itemVisitor = this.pluginMap.get(item)?.visitor;
      if (itemVisitor) {
        Object.keys(itemVisitor).forEach(key => {
          if (!this.visitors[key]) {
            this.visitors[key] = [];
          }
          if (this.visitors[key]) {
            this.visitors[key].push(itemVisitor[key]);
          }
        });
      }
    });
  }

  /**
   * get hooks
   * current only support Mode.PIPE
   * @return {*}
   */
  public getHooks() {
    const hookKeys = Object.keys(this.visitors) as (keyof FoxpageHooks)[];
    if (hookKeys.length === 0) {
      return {};
    }

    const visitors: Partial<Record<keyof FoxpageHooks, () => void>> = {};
    if (this.mode === Mode.PIPE) {
      hookKeys.forEach(key => {
        const hooks = this.visitors[key];
        const executor = async (...args: unknown[]) => {
          let result;
          for (const hook of hooks) {
            // core
            result = await hook(...args);
          }
          return result;
        };
        visitors[key] = executor;
      });
    } else if (this.mode === Mode.DISTRIBUTION) {
      hookKeys.forEach(key => {
        const hooks = this.visitors[key];
        const executor = async (...args: unknown[]) => {
          const result = [];
          for (const hook of hooks) {
            // core
            result.push(await hook(...args));
          }
          return result;
        };
        visitors[key] = executor;
      });
    } else if (this.mode === Mode.COVER) {
      hookKeys.forEach(key => {
        const hooks = this.visitors[key];
        // core: get the last one
        visitors[key] = hooks[hooks.length - 1];
      });
    }
    return visitors;
  }

  /**
   * destroy
   */
  public destroy() {
    this.pluginMap.clear();
  }
}
