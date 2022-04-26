import { outputFile, pathExists } from 'fs-extra';

import { getESModuleExport, Messages, Option, optional, packager } from '@foxpage/foxpage-shared';
import {
  FPPackage,
  FPPackageDependency,
  FPPackageEntrySource,
  FPPackageMeta,
  Logger,
  Package,
  PackageInstallOption,
} from '@foxpage/foxpage-types';

import { locker } from '../cache';
import { createLogger } from '../common';

import { PackageFetcher } from './fetcher';
import { resolvePackageJSPath } from './resolver';
import { loadFile, runInNodeContext } from './utils';
import { wrapCode } from './wrapper';

/**
 * package
 *
 * @export
 * @interface Package
 */
export class PackageInstance implements Package {
  /**
   * package status
   *
   * @type {('preInstall' | 'installing' | 'installed' | 'fail')}
   */
  status: 'preInstall' | 'installing' | 'installed' | 'fail';
  /**
   * package available status
   *
   * @type {boolean}
   */
  available: boolean;
  key: string;
  name: string;
  version: string;
  type: string;
  source: FPPackageEntrySource;
  downloadUrl: string;
  dependencies: FPPackageDependency[];
  deps: string[];
  filePath?: string;
  meta?: FPPackageMeta;

  supportNode: boolean;
  messages: Messages;

  appId: string;

  readonly logger: Logger;

  private _exported?: any;
  private _loaded = false;

  constructor(info: FPPackage, appId: string) {
    this.appId = appId;
    this.status = 'preInstall';
    this.available = false;

    this.name = info.name;
    this.type = info.type;
    this.version = info.version;
    this.key = packager.generateKey(info.name, info.version);
    this.source = info.resource.entry;
    this.downloadUrl = this.source.node.downloadHost + this.source.node.path;
    this.dependencies = info.resource.dependencies || [];
    this.deps = this.dependencies.map(item => item.name);

    this.logger = createLogger('Package');
    this.meta = info.meta;
    this.filePath = resolvePackageJSPath(this.appId, this.name, this.version);
    this.supportNode = true;
    this.messages = new Messages();
  }

  get exported() {
    if (!this.supportNode || !this.filePath) {
      return undefined;
    }
    if (!this._loaded) {
      try {
        this._exported = loadFile(this.filePath);
        this._loaded = true;
      } catch (error) {
        this.messages.push(error as Error);
      }
    }
    return this._exported;
  }

  get componentFactory() {
    return getESModuleExport(this.exported).default;
  }

  /**
   * install package
   *
   * @param {PackageInstallOption} opt
   */
  public async install(opt: PackageInstallOption = {}) {
    this.status = 'installing';
    try {
      await this.fetchCode(opt);
    } catch (error) {
      this.ignore(error as Error);
      return;
    }
    this.available = true;
    this.status = 'installed';
  }

  private async fetchCode({ inspect = false, wrap = true }: PackageInstallOption) {
    if (this.filePath && (await pathExists(this.filePath))) {
      return;
    }

    const fetchResult = await this.fetch();
    if (fetchResult.fail) {
      throw fetchResult.error;
    }

    const code = wrap && this.deps.length > 0 ? wrapCode(fetchResult.data.content, this) : fetchResult.data.content;

    if (inspect) {
      const inspectResult = await this.inspectPackage(code);
      if (inspectResult.fail) {
        const msg = `${this.name}@${this.version} inspect fail: ${inspectResult.error.message}`;
        this.supportNode = false;
        throw new Error(msg);
      }
    }

    await this.processJSCode(code);
  }

  protected async inspectPackage(code: string): Promise<Option<any>> {
    try {
      runInNodeContext(code);
      return optional.ok(true);
    } catch (error) {
      return optional.fail(error);
    }
  }

  private async fetch(source = this.source) {
    if (!source || !source.node) {
      return optional.fail('miss source');
    }

    const fetcher = new PackageFetcher(this.downloadUrl, {
      maxRetryTime: 5,
      downloadTimeout: 3000,
    });
    const result = await fetcher.fetch();
    return result;
  }

  public async processJSCode(jsContent: string) {
    const targetJsPath = resolvePackageJSPath(this.appId, this.name, this.version);
    const lockedStr = targetJsPath.replace('.js', '-locked');
    try {
      const exist = await pathExists(targetJsPath);
      if (!exist) {
        await locker.withLock(lockedStr, async () => {
          await outputFile(targetJsPath, jsContent, {
            encoding: 'utf-8',
            flag: 'wx',
          });
          this.logger.info('install package %s@%j succeed', this.name, this.version);
        });
      }
    } catch (err) {
      this.logger.error(`process [${process.pid}] code failed:`, err);
      throw err;
    }
  }

  protected ignore(message: string | Error) {
    this.available = false;
    this.messages.push(message);
    this.status = 'fail';
    this.logger.warn('install package %s@%j failed:', this.name, this.version, message);
  }
}
