import { isNotNill, packager } from '@foxpage/foxpage-shared';
import {
  Application,
  FPPackage,
  FPPackageResponse,
  Package,
  PackageManager,
  PackageNamedVersion,
  ResourceUpdateInfo,
} from '@foxpage/foxpage-types';

import { ManagerBaseImpl } from '../common';
import { foxpageDataService } from '../data-service';

import { PackageInstance } from './package';

type PackageVersionInfo = { id: string; liveVersion: string; versions: string[] };

/**
 * package manager
 *
 * @export
 * @class PackageManager
 */
export class PackageManagerImpl extends ManagerBaseImpl<Package> implements PackageManager {
  /**
   * cache package name & versions
   * key: package name, value: version list
   * @private
   */
  private packageVersionsMap = new Map<string, PackageVersionInfo>();
  /**
   * package id map
   * key: package id, value: package name
   *
   * @private
   */
  private packageIdMap = new Map<string, string>();

  constructor(app: Application) {
    super(app, { type: 'package', diskCache: { enable: true } });
  }

  /**
   * add package to manager
   *
   * @param {Package} pkg
   */
  public addPackage(pkg: FPPackage) {
    const { id, name, version } = pkg;
    this.logger.debug(`add package content ${name}@${version}`);

    if (!version) {
      this.logger.warn('package version is invalid');
      return null;
    }

    const newPkg = this.newPackage(pkg);

    this.addOne(newPkg.key, pkg, newPkg);
    this.updatePackageVersionsMap(pkg);
    this.updatePackageLiveVersion(pkg);
    this.packageIdMap.set(id, name);

    return newPkg;
  }

  /**
   * remove package from manager via package names
   *
   * @param {string[]} names package names
   */
  public removePackages(names: string[]) {
    const versionInfo = this.getPackageVersionsByNames(names);
    Object.keys(versionInfo).forEach(name => {
      const versions = versionInfo[name];
      if (versions) {
        this.remove(versions.map(item => this.generateKey(name, item)));
      }
      const packageId = this.packageVersionsMap.get(name)?.id;
      if (packageId) {
        this.packageIdMap.delete(packageId);
      }
      this.packageVersionsMap.delete(name);
    });
  }

  /**
   * get package by package name
   * will return the live versions
   * @param {string} type
   * @return {*} {Package | undefined}
   */
  public async getPackage(name: string): Promise<Package | undefined> {
    return (await this.getPackages([name]))[0];
  }

  /**
   * get all packages by package names
   * will return the live versions
   * @param {string[]} names
   * @return {*}  {Promise<Package[]>}
   */
  public async getPackages(names: string[]): Promise<Package[]> {
    const keys = names.map(name => {
      const liveVersion = this.getPackageLiveVersion(name);
      return this.generateKey(name, liveVersion || '');
    });
    return await this.find(keys);
  }

  /**
   * select one version
   *
   * @param {string} name package name
   * @return {*}
   */
  public getPackageLiveVersion(name: string) {
    return this.packageVersionsMap.get(name)?.liveVersion;
  }

  /**
   * update package live version
   *
   * @param {string} pkg package content
   */
  public updatePackageLiveVersion(pkg: FPPackage) {
    if (pkg.isLive) {
      const pkgInfo = this.packageVersionsMap.get(pkg.name);
      if (pkgInfo) {
        pkgInfo.liveVersion = pkg.version;
      }
    }
  }

  /**
   * get package sync from hot
   * @param name package name
   * @param version package version
   * @returns pkg
   */
  public getPackageSync(name: string, version?: string): Package | null {
    const versions = this.getPackageVersionsByNames([name])[name];
    if (!versions) {
      return null;
    }

    if (version && versions.indexOf(version) === -1) {
      this.logger.debug(`get local package: ${name}@${version} is empty.`);
      return null;
    }

    // !version use live version, or use appoint version
    let curVersion = this.getPackageLiveVersion(name);
    if (version && version !== curVersion) {
      this.logger.info(`package ${name} local live version is: ${curVersion}, appoint version is: ${version}`);
      curVersion = version;
    }
    if (!curVersion) {
      this.logger.debug('the version is invalid');
      return null;
    }

    const key = this.generateKey(name, curVersion);
    const pkg = this.findOne(key);
    if (!pkg || pkg.version !== curVersion) {
      this.logger.warn(`get local package: ${key} is empty.`);
      return null;
    }

    this.logger.debug(`get local package: ${key} succeed.`);
    return pkg;
  }

  /**
   * get local package
   *
   * @param {string} name package name
   * @param {string} version package version
   * @return {*}  {(Package | null)}
   */
  public async getLocalPackage(name: string, version?: string): Promise<Package | null> {
    const versions = this.getPackageVersionsByNames([name])[name];
    if (!versions) {
      return null;
    }

    if (version && versions.indexOf(version) === -1) {
      this.logger.debug(`get local package: ${name}@${version} is empty.`);
      return null;
    }

    // !version use live version, or use appoint version
    let curVersion = this.getPackageLiveVersion(name);
    if (version && version !== curVersion) {
      this.logger.info(`package ${name} local live version is: ${curVersion}, appoint version is: ${version}`);
      curVersion = version;
    }
    if (!curVersion) {
      this.logger.debug('the version is invalid');
      return null;
    }

    const key = this.generateKey(name, curVersion);
    const pkg = await this.findOneFromLocal(key);
    if (!pkg || pkg.version !== curVersion) {
      this.logger.warn(`get local package: ${key} is empty.`);
      return null;
    }

    this.logger.debug(`get local package: ${key} succeed.`);
    return pkg;
  }

  /**
   * fetch packages, instance packages and install packages then add to local
   * note: return contains package dependencies contents
   * @param {{ nameVersions?: PackageNamedVersion[]; packageIds?: string[] }} [params]
   * @return {*}
   */
  public async freshPackages(params?: { namedVersions?: PackageNamedVersion[]; packageIds?: string[] }) {
    const packages = params?.namedVersions
      ? this.resolvePackage(await this.fetchPackagesByNamedVersions(params.namedVersions))
      : await this.fetchPackages(params?.packageIds);

    this.logger.debug('fetched packages %j', packages);
    return await this.install(packages, { cache: true });
  }

  /**
   * install packages
   *
   * @param {FPPackage[]} packages
   * @param {{ cache: boolean }} [opt] {cache: will add package instance to manager}
   * @return {*}
   */
  public async install(packages: FPPackage[], opt?: { cache: boolean }) {
    const installs = await this.initInstalls(packages, opt);

    const tasks = installs.map(async item => {
      await item.install();
      return item;
    });

    const result = await Promise.all(tasks);
    return result;
  }

  /**
   * fetch packages from server
   *
   * @param {string[]} [packageIds]
   * @return {*}
   */
  public async fetchPackages(packageIds?: string[]) {
    return await foxpageDataService.fetchAppPackages(this.appId, { packageIds });
  }

  /**
   * fetch packages with name and version from server
   *
   * @param {PackageNamedVersion[]} nameVersions
   * @return {Promise<FPPackageResponse[]>}
   */
  public async fetchPackagesByNamedVersions(nameVersions: PackageNamedVersion[]) {
    return await foxpageDataService.fetchAppPackagesByNamedVersions(this.appId, { nameVersions });
  }

  /**
   * listen the "ON_PULL" event
   * updates & removes is the package content id list
   * @protected
   * @param {ResourceUpdateInfo} data
   * @return {*}  {Promise<void>}
   */
  protected async onPull(data: ResourceUpdateInfo): Promise<void> {
    const { updates, removes } = data.component || {};
    if (updates && updates.length > 0) {
      // this.markNeedUpdates(updates);
      await this.freshPackages({ packageIds: updates });
    }
    if (removes && removes.length > 0) {
      this.removePackages(removes.map(item => this.packageIdMap.get(item)).filter(isNotNill));
    }
  }

  /**
   * on fetch
   * list: the manager keys
   * @protected
   * @param {string[]} list
   * @return {*}  {Promise<PackageImpl[]>}
   */
  protected async onFetch(list: string[]): Promise<PackageInstance[]> {
    return await this.freshPackages({
      namedVersions: list.map(item => {
        const [name, version] = this.splitKey(item);
        return { name, version };
      }),
    });
  }

  protected async createInstance(data: FPPackage) {
    const instance = this.newPackage(data);
    await instance.install();
    return instance;
  }

  private newPackage(data: FPPackage) {
    return new PackageInstance(data, this.appId);
  }

  private resolvePackage(packageInfos: FPPackageResponse[]) {
    return packageInfos.map(item => item.package);
  }

  /**
   * init need install package instances
   *
   * @private
   * @param {FPPackage[]} packages
   * @param {{ cache: boolean }} [opt]
   * @return {*}
   */
  private async initInstalls(packages: FPPackage[], opt?: { cache: boolean }) {
    const installMap = new Map<string, PackageInstance>();

    const create = async (list: FPPackage[], { initDependencies } = { initDependencies: false }) => {
      for (const pkg of list) {
        const { name, version, components } = pkg;
        const key = this.generateKey(name, version);
        const localPkg = await this.getLocalPackage(name, version);

        // will install it
        if ((!localPkg || !localPkg.available) && !installMap.has(key)) {
          let newPkg: PackageInstance | null;
          if (opt?.cache) {
            newPkg = await this.addPackage(pkg);
          } else {
            newPkg = new PackageInstance(pkg, this.appId);
          }
          if (newPkg) {
            installMap.set(key, newPkg);
          }
        } else {
          if (opt?.cache) {
            this.updatePackageLiveVersion(pkg);
          }
        }

        // init components
        // components: the dependencies contents
        if (initDependencies && components?.length) {
          await create(components);
        }
      }
    };

    await create(packages, { initDependencies: true });
    return Array.from(installMap.values());
  }

  /**
   * get package versions
   *
   * @private
   * @param {string[]} names package names
   * @return {*} {[key]: package name, [value]: versions}
   */
  private getPackageVersionsByNames(names: string[]) {
    const versionInfo: Record<string, string[] | null> = {};
    names.forEach(name => {
      const { versions } = this.packageVersionsMap.get(name) || {};
      if (!versions) {
        this.logger.debug(`not exist the package@${name} in packageMap`);
        versionInfo[name] = null;
      } else {
        versionInfo[name] = versions;
      }
    });
    return versionInfo;
  }

  private updatePackageVersionsMap(pkg: FPPackage) {
    const { id, name, version } = pkg;
    const { versions } = this.packageVersionsMap.get(name) || {};
    if (versions) {
      versions.push(version);
    } else {
      this.packageVersionsMap.set(name, { id, liveVersion: '', versions: [version] });
      this.updatePackageLiveVersion(pkg);
    }
  }

  private generateKey = (name: string, version: string) => {
    return packager.generateKey(name, version);
  };

  private splitKey = (key: string) => {
    return packager.splitKey(key);
  };

  public destroy() {
    super.destroy();
    this.packageIdMap.clear();
    this.packageVersionsMap.clear();
  }
}
