import { join } from 'path';

import { outputJSON, pathExists } from 'fs-extra';

import { FOXPAGE_ROOT } from '../common';

import { withLock } from './locker';

export const FOXPAGE_CONTENT = 'contents';
export const FOXPAGE_CONTENT_FILE = '.json';

const DIR_MARK = `${process.platform === 'win32' ? '\\' : '/'}`;

export function resolveContentDir(appId: string, dirs: string[]) {
  return join(FOXPAGE_ROOT, appId, FOXPAGE_CONTENT, ...dirs);
}

export function resolveContentPath(appId: string, dirs: string[]) {
  const filename = dirs.pop();
  const dir = resolveContentDir(appId, dirs);
  const filePath = join(dir, `${filename}${FOXPAGE_CONTENT_FILE}`);
  return filePath;
}

export async function storeContent<T>(filePath: string, content?: T) {
  if (!content) {
    return;
  }

  if (await pathExists(filePath)) {
    return;
  }

  let lockStr = filePath.replace('.json', '-locked');

  // TODO:
  const pkgMark = `contents${DIR_MARK}packages`;
  const [dir, value] = lockStr.split(pkgMark);
  if (value) {
    const layers = Array.from(value.split(DIR_MARK));
    const last = layers.pop();
    lockStr = dir + pkgMark + (layers.join(DIR_MARK) + '-' + last).replace(':', '_').replace(/\./g, '-');
  }

  // for record cache time
  //@ts-ignore
  content._lastModified = new Date().getTime();
  await withLock(lockStr, () => outputJSON(filePath, content, { spaces: 2, flag: 'wx' }));
}
