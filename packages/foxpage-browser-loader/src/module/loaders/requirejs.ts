import { getWindow } from '../config';

import { loadScript } from './asset';

interface RequireJSFn {
  <T1 = any>(mods: [string], cb: (...libs: [T1]) => void, errorCb?: (error: Error) => void): void;
  <T1 = any, T2 = any>(mods: [string, string], cb: (...libs: [T1, T2]) => void, errorCb?: (error: Error) => void): void;
  <T1 = any, T2 = any, T3 = any>(
    mods: [string, string],
    cb: (...libs: [T1, T2, T3]) => void,
    errorCb?: (error: Error) => void,
  ): void;
}

type RequireJSContext = RequireJSFn;

interface RequireJS extends RequireJSFn {
  config(
    opt: Partial<{
      context: string;
      baseUrl: string;
      paths: Record<string, string>;
      waitSeconds: number;
      map: Record<string, Record<string, string>>;
    }>,
  ): RequireJSContext;
  s: {
    contexts: Record<string, any>;
  };
}

declare global {
  interface Window {
    require?: RequireJS;
    requirejs?: RequireJS;
    define?: {
      (moduleName: string, cb: () => any): void;
      amd?: Record<string, boolean>;
    };
    __FOXPAGE_REQUIREJS_CONTEXTS__: any[];
  }
}

interface RequirejsContext {
  mods: Record<string, string>;
  req: RequireJSFn;
  contextName: string;
}

let requirejsContexts: RequirejsContext[] = (getWindow().__FOXPAGE_REQUIREJS_CONTEXTS__ = []);
let sharedConfigPaths: Record<string, string> = {};

const find = <T = any>(array: T[], cb: (item: T) => boolean): T | undefined => {
  for (let index = 0; index < array.length; index++) {
    const element = array[index];
    if (cb(element)) {
      return element;
    }
  }
};

function getRequirejsContext(req: RequireJS, name: string, version = 'default'): RequirejsContext {
  // find context, if this context has not loaded this module or has same version, it available
  let availableContext = find(requirejsContexts, c => c.mods[name] === undefined || c.mods[name] === version);

  // if not find, create new requirejs context
  if (!availableContext) {
    const contextName = `_foxpage_context_${requirejsContexts.length}`;
    const clonePaths = { ...sharedConfigPaths };
    delete clonePaths[name];
    availableContext = {
      mods: {},
      contextName,
      req: req.config({
        context: contextName,
        paths: clonePaths,
        waitSeconds: 0,
      }),
    };
    requirejsContexts.push(availableContext);
  }

  availableContext.mods[name] = version;

  return availableContext;
}

export function safeConfigRequirePath(req: RequireJS, name: string, url: string = name, requireContextName?: string) {
  if (!name || !url) {
    return;
  }
  const configUrl = url.indexOf('?') > -1 ? url : url.substring(0, url.lastIndexOf('.'));

  sharedConfigPaths[name] = configUrl;

  // apply to other context
  // make every context has same paths config expect special module
  for (let index = 0; index < requirejsContexts.length; index++) {
    const context = requirejsContexts[index];
    if (!(name in context.mods)) {
      req.config({
        context: context.contextName,
        paths: {
          [name]: configUrl,
        },
        waitSeconds: 0,
      });
    }
  }

  req.config({
    context: requireContextName,
    paths: {
      // requirejs 会自动加上 .js
      [name]: configUrl,
    },
    waitSeconds: 0,
  });
}

/**
 * load amd module by requirejs
 * if result is undefined, try load again by alias name
 * @param name
 * @param param1
 */
export function loadAmdModule<T = any>(
  name: string,
  { alias = [] as string[], url, version }: { alias: string[]; url: string; version?: string },
) {
  const win = getWindow();
  const requirejsFn = win.requirejs || win.require;

  if (!requirejsFn) {
    throw new Error("can't find RequireJS, you may forget load it");
  }

  const { req, contextName } = getRequirejsContext(requirejsFn, name, version);

  if (url) {
    safeConfigRequirePath(requirejsFn, name, url, contextName);
  }

  return new Promise<T>((resolve, reject) => {
    req<T | PromiseLike<T> | undefined>(
      [name],
      res => {
        if (typeof res === 'undefined' && alias.length) {
          const find = (idx: number) => {
            const otherName = alias[idx];

            // if find all, resolve origin result
            if (!otherName) {
              resolve(res as T | PromiseLike<T>);
              return;
            }

            req<T | undefined>(
              [otherName],
              res => {
                if (typeof res !== 'undefined') {
                  (win.define as NonNullable<Window['define']>)(name, () => res);
                  resolve(res);
                } else {
                  // find next
                  find(idx + 1);
                }
              },
              () => find(idx + 1),
            );
          };

          return find(0);
        }
        return resolve(res as T | PromiseLike<T>);
      },
      error => {
        console.error(error);
        reject(error);
      },
    );
  });
}

let loadPromise: Promise<any> | undefined;
export function loadRequirejs(link: string) {
  const win = getWindow();
  if (win.define?.amd) {
    return Promise.resolve();
  }
  if (!loadPromise) {
    loadPromise = loadScript(link);
  }
  return loadPromise;
}

export function destroyLoadRequire() {
  loadPromise = undefined;
  requirejsContexts = getWindow().__FOXPAGE_REQUIREJS_CONTEXTS__ = [];
  sharedConfigPaths = {};
}
