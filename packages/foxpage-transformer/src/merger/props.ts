import { cloneDeep, has, isArray, isEmpty, isObject } from 'lodash';

import { FoxpageComponentProps } from '../interface';

export const combineProps = (mergedProps: FoxpageComponentProps, matchedProps: FoxpageComponentProps) => {
  const result = mergedProps;
  for (const key in matchedProps) {
    if (has(matchedProps, key)) {
      if (has(mergedProps, key) && isObject(mergedProps[key]) && isObject(matchedProps[key])) {
        if (!isEmpty(matchedProps[key])) {
          // empty object
          if (!isArray(mergedProps[key]) && !isArray(matchedProps[key])) {
            result[key] = combineProps(mergedProps[key], matchedProps[key]);
          } else {
            result[key] = matchedProps[key];
          }
        }
      } else {
        result[key] = matchedProps[key];
      }
    }
  }
  return result;
};

export const replaceProps = (mergedProps: FoxpageComponentProps, matchedProps?: FoxpageComponentProps) => {
  if (!matchedProps) {
    return mergedProps || {};
  }

  return cloneDeep(matchedProps);
};
