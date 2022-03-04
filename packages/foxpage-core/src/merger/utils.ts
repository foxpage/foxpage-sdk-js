// @ts-ignore
import is from 'is-type-of';

const hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * merge the any object
 * @param base base data
 * @param current current data
 * @returns merged data
 */
export const mergeObject = <P extends Record<string, any>>(base: P, current: P) => {
  const result = base;
  for (const key in current) {
    if (hasOwnProperty.call(current, key)) {
      if (hasOwnProperty.call(base, key) && is.object(base[key]) && is.object(current[key])) {
        if (!is.array(base[key]) && !is.array(current[key])) {
          result[key] = mergeObject(base[key], current[key]);
        } else {
          result[key] = current[key];
        }
      } else {
        result[key] = current[key];
      }
    }
  }
  return result;
};
