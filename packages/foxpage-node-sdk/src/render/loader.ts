import _ from 'lodash';

import { getApplication } from '@foxpage/foxpage-manager';
import { Messages, packager } from '@foxpage/foxpage-shared';
import {
  Application,
  ComponentLoader,
  ComponentLoadOption,
  FoxpageComponent,
  FPPackage,
  FPPackageDependency,
  Logger,
  Package,
  PackageNamedVersion,
  StructureNode,
} from '@foxpage/foxpage-types';

import { loggerCreate } from '../logger';

/**
 * component loader
 *
 * @export
 * @class ComponentLoaderImpl
 * @implements {ComponentLoader}
 */
export class ComponentLoaderImpl implements ComponentLoader {
  app?: Application;
  opt: ComponentLoadOption;
  /**
   * the loaded components map
   *
   * @private`
   */
  private loadedMap = new Map<string, FoxpageComponent>();
  /**
   * miss load componentMap
   *
   * @private
   */
  private missLoadMap = new Map<string, StructureNode>();
  /**
   * id -> version map
   *
   * @private
   */
  private resolvedVersionMap = new Map<string, string>();
  /**
   * all dependencies
   * "name":"version" list
   * @private
   * @type {string[]}
   */
  private dependencies: string[] = [];
  /**
   * dependencies loaded map
   *
   * @private
   */
  private loadedDependencyMap = new Map<string, FoxpageComponent>();
  /**
   * dependencies miss load
   * key: "name":"version", value: {name, version}
   * @private
   * @type {FPPackageDependency[]}
   */
  private missLoadDependencyMap = new Map<string, FPPackageDependency>();
  /**
   * for record the missed package version that had fetched from server
   * "name":"version" | "name":""  -> "name":"version",
   * @private
   */
  private missedVersionMap = new Map<string, string>();

  private logger: Logger;

  constructor(appId: string, opt: ComponentLoadOption = { autoDownloadComponent: true, useStructureVersion: false }) {
    this.app = getApplication(appId);
    this.opt = opt;
    this.logger = loggerCreate('ComponentLoader');
  }

  /**
   * load components
   * @param {StructureNode[]} schemas
   */
  public async load(schemas: StructureNode[]) {
    await this.resolveComponents(schemas);
    await this.resolveDependencies();

    // auto download the missed packages
    if (this.opt.autoDownloadComponent) {
      const loadedMap = await this.downloadMisses();
      await this.resolveMisses(loadedMap);
    }
  }

  /**
   * get loaded components
   *
   * @return {*} {Map<string, FoxpageComponent>}
   */
  public getLoadedComponents(): Map<string, FoxpageComponent> {
    return this.loadedMap;
  }

  /**
   *  get loaded dependencies
   *
   * @return {*}  {Map<string, FoxpageComponent>}
   */
  public getLoadedDependencies(): Map<string, FoxpageComponent> {
    return this.loadedDependencyMap;
  }

  /**
   * destroy: clear all source
   *
   */
  public destroy() {
    this.loadedMap.clear();
    this.missLoadMap.clear();
    this.resolvedVersionMap.clear();
    this.dependencies = [];
    this.loadedDependencyMap.clear();
    this.missLoadDependencyMap.clear();
    this.missedVersionMap.clear();
  }

  /**
   * download the missed packages
   *
   * @private
   * @return {*}
   */
  private async downloadMisses() {
    const loadedMap = new Map<string, Package | null>();

    // get all messed packages name & versions
    const namedVersions = this.getMissedPackages();

    if (namedVersions.length > 0) {
      this.logger.info('fetch missed packages from server:', namedVersions);

      // fetch from server
      const fetches = await this.app?.packageManager.fetchPackagesByNamedVersions(namedVersions);

      // get need install packages
      const packages: FPPackage[] = [];
      fetches?.forEach(item => {
        const key = this.generateKey(item.name, item.version);
        this.missedVersionMap.set(key, this.generateKey(item.package.name, item.package.version));
        packages.push(item.package);
      });

      // install
      const installed = await this.app?.packageManager.install(packages, { cache: true });
      installed?.forEach(item => {
        loadedMap.set(this.generateKey(item.name, item.version), item);
      });
    }

    return loadedMap;
  }

  /**
   * resolve the missed packages
   *
   * @private
   * @param {(Map<string, Package | null>)} loadedMap
   */
  private async resolveMisses(loadedMap: Map<string, Package | null>) {
    const resolver = <T extends StructureNode | FPPackageDependency>(
      list: T[],
      cb: (item: T, pkg: Package | null | undefined, messages: Messages) => void,
    ) => {
      list.forEach(item => {
        const messages = new Messages();
        const { name, version = '' } = item;
        const key = this.generateKey(name, version);
        const missKey = this.missedVersionMap.get(key);
        const pkg = missKey ? loadedMap.get(missKey) : null;

        let msg = '';
        if (pkg) {
          msg = `package ${key} load succeed with version: ${pkg.version}`;
          // logger.info(msg);
        } else {
          msg = `package ${key} load failed`;
          // logger.warn(msg);
        }

        messages.push(msg);

        if (typeof cb === 'function') {
          cb(item, pkg, messages);
        }
      });
    };
    // resolve missed component
    resolver(
      Array.from(this.missLoadMap.values()),
      (item: StructureNode, pkg: Package | null | undefined, messages: Messages) => {
        this.loadedMap.set(item.id, this.componentFormatter(item, pkg, messages));
      },
    );
    // resolve missed dependencies
    resolver(
      Array.from(this.missLoadDependencyMap.values()),
      (item: FPPackageDependency, pkg: Package | null | undefined, messages: Messages) => {
        const key = this.generateKey(item.name, item.version);
        this.loadedDependencyMap.set(
          key,
          this.componentFormatter(this.generateStructureNode(key, item.name, item.version || ''), pkg, messages),
        );
      },
    );
  }

  /**
   * resolve the component
   * for divide the available or invalid
   * @private
   * @param {StructureNode[]} schemas
   */
  private async resolveComponents(schemas: StructureNode[]) {
    for (const item of schemas) {
      const { id, name, version = '', children } = item; // schema structure node
      const key = this.generateKey(name, version);
      if (this.isComponent(item) && !this.loadedMap.has(key)) {
        const messages = new Messages();

        // get component from local
        const pkg = await this.app?.packageManager.getLocalPackage(name, this.opt?.useStructureVersion ? version : '');
        if (pkg && pkg.available) {
          messages.push(`component@${item.id} -> package ${pkg.name} local version: ${pkg.version}`);

          // collect the dependencies
          pkg.dependencies?.forEach(dep => {
            this.dependencies.push(this.generateKey(dep.name, dep.version));
          });

          this.loadedMap.set(id, this.componentFormatter(item, pkg, messages));
          this.setResolveVersion(item, pkg.version);
        } else {
          this.logger.debug(
            `component@${item.id} -> package ${key} local not exist available version, try to download`,
          );

          this.missLoadMap.set(id, item);
          this.setResolveVersion(item, '');
        }
      }

      if (children && children.length > 0) {
        await this.resolveComponents(children);
      }
    }
  }

  /**
   * resolve the dependencies
   *
   * @private
   */
  private async resolveDependencies() {
    for (const key of this.dependencies) {
      const [name, version = ''] = this.splitKey(key);
      const messages = new Messages();

      const pkg = await this.app?.packageManager.getLocalPackage(name, version);
      if (pkg && pkg.available) {
        messages.push(`dependency ${key} loaded`);

        this.loadedDependencyMap.set(
          key,
          this.componentFormatter(this.generateStructureNode(key, name, version), pkg, messages),
        );
      } else {
        this.logger.warn(`dependency ${key} loaded failed, try to auto download.`);
        this.missLoadDependencyMap.set(key, { name, version });
      }
    }
  }

  /**
   * get the missed packages
   *
   * @private
   * @return {PackageNamedVersion} namedVersions
   */
  private getMissedPackages() {
    const missComponents = Array.from(this.missLoadMap.values());
    const missList = missComponents
      .map(item => {
        const pkgInfo = {
          name: item.name,
          version: this.resolvedVersionMap.get(item.id),
        } as PackageNamedVersion;
        return pkgInfo;
      })
      .concat(Array.from(this.missLoadDependencyMap.values()) as PackageNamedVersion[]);

    const namedVersions = _.uniqWith(missList, _.isEqual);
    return namedVersions;
  }

  private componentFormatter(node: StructureNode, pkg?: Package | null, messages?: Messages): FoxpageComponent {
    const newMsg = messages || new Messages();
    if (pkg) {
      const { type, source, supportNode, deps, componentFactory, downloadUrl, messages: pkgMessages } = pkg;
      pkgMessages.forEach(msg => {
        newMsg.push(msg);
      });
      const { browser, debug, css } = source;
      const browserURL = browser.host && browser.path ? browser.host + browser.path : '';
      const debugURL = debug.path && debug.host ? debug.host + debug.path : browserURL;
      const cssURL = css?.host && css?.path ? css.host + css.path : '';
      let meta = pkg.meta;
      // will remove
      if (!meta) {
        meta = {};
      }
      if (cssURL) {
        meta.assets = [{ url: cssURL, type: 'css' }];
      }

      return {
        type,
        name: node.name,
        version: node.version || pkg.version,
        browserURL,
        debugURL,
        nodeURL: downloadUrl,
        cssURL,
        supportSSR: supportNode,
        factory: componentFactory,
        dependencies: deps,
        source,
        meta,
        messages,
      } as FoxpageComponent;
    }

    return {
      name: node.name,
      version: node.version,
      messages: newMsg.hasError ? newMsg : undefined,
    } as FoxpageComponent;
  }

  private generateStructureNode(key: string, name: string, version: string) {
    return { id: `builtin_${key}`, name, version, props: {}, type: 'react.component' } as StructureNode;
  }

  private setResolveVersion(structureNode: StructureNode, version: string) {
    if (!this.resolvedVersionMap.has(structureNode.id)) {
      this.resolvedVersionMap.set(structureNode.id, version);
    }
  }

  private isComponent(structureNode: StructureNode) {
    return !!structureNode.name;
  }

  private generateKey(name: string, version?: string) {
    return packager.generateKey(name, version);
  }

  private splitKey = (key: string) => {
    return packager.splitKey(key);
  };
}
