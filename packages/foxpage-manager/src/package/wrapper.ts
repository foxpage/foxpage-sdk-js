import { pick } from '@foxpage/foxpage-shared';

export interface WrappedPackageDetail {
  name?: string;
  version?: string;
  dependencies?: Record<string, string>;
}

/**
 * wrap require
 *
 * @export
 * @param {NodeRequire} req
 * @param {WrappedPackageDetail} [{ dependencies = {} }={}]
 * @return {*}  {NodeRequire}
 */
export function wrapRequire(req: NodeRequire, { dependencies = {} }: WrappedPackageDetail = {}): NodeRequire {
  const overrideRequireId = Object.entries(dependencies).reduce<Record<string, { name: string; version: string }>>(
    (deps, [name, version]) => {
      deps[name] = deps[`${name}@${version}`] = {
        name,
        version,
      };
      return deps;
    },
    {},
  );
  const wrappedRequire: (id: string) => any = (id: string) => {
    if (id in overrideRequireId) {
      // const { name, version } = overrideRequireId[id];
      // const foxpagePackage = foxpagePackageManager.get(name)?.get(version);
      // if (foxpagePackage && foxpagePackage.available) {
      //   return foxpagePackage.exported;
      // }
    }
    return req(id);
  };
  Object.assign(wrappedRequire, req);
  return wrappedRequire as NodeRequire;
}

const fnName = 'wrapRequire';

/**
 * to support foxpage package require other foxpage package, we need impl my `require` fn to override original
 * @param code
 */
export function wrapCode(code: string, detail: WrappedPackageDetail): string {
  const data: WrappedPackageDetail = pick(detail, ['name', 'version', 'dependencies']);
  const arg = JSON.stringify(data, undefined, 2);
  const filepath = __filename.replace(/\\/g, '\\\\');
  const wrapped = `
;var require = require("${filepath}").${fnName}(require, ${arg});

${code}
`;
  return wrapped;
}
