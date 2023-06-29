import { MessageArray } from '../../common/message';
import { ComponentLoadOption } from '../../component';
import { ManagerBase } from '..';

export interface FPPackage {
  /**
   * package content id
   *
   * @type {string}
   */
  id: string;
  name: string;
  type: 'component' | 'lib';
  isLive?: boolean;
  version: string;
  resource: FPPackageResource;
  meta?: FPPackageMeta;
  /**
   * package dependencies content list
   *
   * @type {FPPackage[]}
   */
  components?: FPPackage[];
}

export interface FPPackageResponse {
  name: string;
  version: string;
  package: FPPackage;
}

export interface FPPackageDependency {
  name: string;
  version?: string;
}

export interface FPPackageResource {
  origin: string;
  entry: FPPackageEntrySource;
  dependencies?: FPPackageDependency[];
}

export interface FPUrlInfo {
  host: string;
  downloadHost: string;
  path: string;
  origin: string;
}

export interface FPPackageEntrySource {
  browser: FPUrlInfo;
  node: FPUrlInfo;
  debug: FPUrlInfo;
  css?: FPUrlInfo;
}

export interface FPPackageMeta {
  useStyledComponent?: boolean;
  isMountNode?: boolean;
  isHead?: boolean;
  isBody?: boolean;
  csrEntry?: boolean;
  // will remove
  [key: string]: any;
}

export type PackageURLSource = { type: 'url'; url: string };
export type PackageFilesystemSource = { type: 'file'; filepath: string; md5?: string };
export type PackageCodeSource = { type: 'code'; code: string };
export type PackageNetSource = string | PackageURLSource;
export type PackageSource = PackageNetSource | PackageFilesystemSource | PackageCodeSource;

export interface PackageInstallOption {
  inspect?: boolean;
  wrap?: boolean;
}

export interface Package {
  status: 'preInstall' | 'installing' | 'installed' | 'fail';
  available: boolean;
  key: string;
  name: string;
  type: string;
  version: string;
  filePath?: string | undefined;
  source: FPPackageEntrySource;
  downloadUrl: string;
  dependencies: FPPackageDependency[];
  deps: string[];
  meta?: FPPackageMeta | undefined;

  appId: string;

  supportNode: boolean;
  exported?: any;
  componentFactory?: any;
  messages: MessageArray;

  install(opt: PackageInstallOption): void;
}

export interface PackageNamedVersion {
  name: string;
  version: string;
}

export interface PackageVersionMap extends Map<string, Package> {}

export interface PackageFreshOption {
  namedVersions?: PackageNamedVersion[];
  packageIds?: string[];
  strategy?: 'loadOnIgnite' | 'all';
}

export type PackageFetchOption = Pick<ComponentLoadOption, 'isCanary' | 'isPreviewMode'>;

export interface PackageManager<T = FPPackage> extends ManagerBase<T> {
  addPackage(content: FPPackage): Package | null;
  removePackages(names: string[]): void;
  getPackage(name: string, version?: string): Promise<Package | undefined>;
  getPackageSync(name: string, version?: string): Package | null;
  getLocalPackage(name: string, version?: string): Promise<Package | null>;
  freshPackages(params?: PackageFreshOption): Promise<Package[]>;
  fetchPackages(packageIds?: string[], opt?: Pick<PackageFreshOption, 'strategy'>): Promise<FPPackage[]>;
  fetchPackagesByNamedVersions(
    nameVersions: PackageNamedVersion[],
    opt?: PackageFetchOption,
  ): Promise<FPPackageResponse[]>;
  install(packages: FPPackage[], opt?: { cache: boolean; ignoreLocal?: boolean }): Promise<Package[]>;
}
