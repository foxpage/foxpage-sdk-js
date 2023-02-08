import { join } from 'path';

import { FOXPAGE_ROOT } from '../common';

export const FOXPAGE_PACKAGE = 'modules';
export const PACKAGE_JSON_FILENAME = 'package';

export function resolvePackageDir(appId: string, packageName = '', version?: string) {
  return version
    ? join(FOXPAGE_ROOT, appId, FOXPAGE_PACKAGE, packageName, version)
    : join(FOXPAGE_ROOT, appId, FOXPAGE_PACKAGE, packageName);
}

export function resolvePackageJSPath(appId: string, packageName: string, version: string, hash?: string) {
  const dir = resolvePackageDir(appId, packageName, version);
  const fileName = `index${hash ? '.' + hash : ''}.js`;
  const filePath = join(dir, fileName);
  return filePath;
}

export function resolvePackageJSONPath(appId: string, packageName: string, ver: string, salt?: string) {
  return join(resolvePackageDir(appId, packageName, ver), `${PACKAGE_JSON_FILENAME}${salt ? `.${salt}` : ''}.json`);
}
