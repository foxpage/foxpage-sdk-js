/**
 * get the export data
 * @param exportData export data
 * @returns
 */
export function getDefaultExport<T = Record<string, any>>(exportData: T | { __esModule: true; default: T }): T {
  if (typeof exportData !== 'object' || exportData === null) {
    return exportData;
  }
  if ((exportData as any).__esModule === true && 'default' in (exportData as any)) {
    return (exportData as { default: T })['default'];
  }
  return exportData as T;
}
