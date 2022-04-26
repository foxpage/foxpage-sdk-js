import { pick } from '@foxpage/foxpage-shared';

import { getApplication } from '../service';

export interface WrappedPackageDetail {
  appId?: string;
  name?: string;
  version?: string;
  deps?: string[];
}

/**
 * wrap require
 *
 * @export
 * @param {NodeRequire} req
 * @param {WrappedPackageDetail} [{ deps = [] }={}]
 * @return {*}  {NodeRequire}
 */
export function wrapRequire(req: NodeRequire, { appId = '', deps }: WrappedPackageDetail = {}): NodeRequire {
  const wrappedRequire: (id: string) => any = (id: string) => {
    const idx = deps ? deps.findIndex(it => it === id) : -1;
    if (idx > -1) {
      const foxpagePackage = getApplication(appId)?.packageManager.getPackageSync(id);
      if (foxpagePackage && foxpagePackage.available) {
        return foxpagePackage.exported;
      }
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
  const data: WrappedPackageDetail = pick(detail, ['appId', 'name', 'version', 'deps']);
  const arg = JSON.stringify(data, undefined, 2);
  const filepath = __filename.replace(/\\/g, '\\\\');
  const wrapped = `
;var require = require("${filepath}").${fnName}(require, ${arg});

${code}
`;
  return wrapped;
}
