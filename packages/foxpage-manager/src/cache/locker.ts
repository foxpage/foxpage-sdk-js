import fs from 'fs-extra';

/**
 * the locked cached
 */
const locked: Record<string, 1 | 0> = {};

/**
 * lock file
 * @param dir mkdir value
 * @param cb callback
 */
export const lock = async (dir: string, cb: (error?: NodeJS.ErrnoException) => unknown) => {
  if (locked[dir]) {
    return cb(new Error('exists locked'));
  }

  try {
    const splitIdx = dir.lastIndexOf(process.platform === 'win32' ? '\\' : '/');
    if (splitIdx > -1) {
      const rootDirStr = dir.substring(0, splitIdx);
      if (rootDirStr) {
        await fs.ensureDir(rootDirStr);
      }
    }

    await fs.mkdir(dir);
    locked[dir] = 1;
  } catch (e) {
    const isExistError = (e as NodeJS.ErrnoException).code === 'EEXIST' || String(e).includes('exists');
    if (isExistError) {
      return cb(e as NodeJS.ErrnoException);
    }
    throw e;
  }

  return cb();
};

/**
 * unlock file
 * @param dir mkdir value
 */
export const unlock = async (dir: string) => {
  await fs.remove(dir);
  if (locked[dir]) {
    delete locked[dir];
  }
};

/**
 * lock & unlock
 * @param dir dir
 * @param cb lock callback
 */
export const withLock = async (dir: string, cb: () => Promise<any>) => {
  await lock(dir, async error => {
    if (!error) {
      try {
        await cb();
        await unlock(dir);
      } catch (err) {
        await unlock(dir);
        throw err;
      }
    }
  });
};

process.on('exit', () => {
  Object.keys(locked).forEach(dir => {
    fs.removeSync(dir);
  });
});
