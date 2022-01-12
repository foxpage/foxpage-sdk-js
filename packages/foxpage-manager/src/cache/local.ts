import { join } from 'path';

import { outputJSON } from 'fs-extra';

import { FOXPAGE_ROOT } from '../common';

export const FOXPAGE_CONTENT = 'contents';
export const FOXPAGE_CONTENT_FILE = '.json';

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
  try {
    // if (await pathExists(filePath)) {
    //   return;
    // }

    await outputJSON(filePath, content, { spaces: 2 });
  } catch (_error) {}
}
