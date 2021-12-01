import { ContentDetail, Page, RelationInfo } from '@foxpage/foxpage-types';

import { ContentDetailInstance } from './content';

type ContentHandleType = RelationInfo & { page: Page[] };

/**
 *
 * @param contents
 * @returns handled contents
 */
export const createContentInstance = <K extends keyof Omit<RelationInfo, 'sysVariables'> | 'page'>(
  contents: ContentHandleType,
): ContentHandleType => {
  const result = {} as ContentHandleType;

  Object.keys(contents).forEach(key => {
    const keyStr = key as K;
    const list = contents[keyStr] as ContentDetail[];
    if (!result[keyStr]) {
      result[keyStr] = [];
    }
    list.forEach(item => {
      result[keyStr]?.push(new ContentDetailInstance<any>(item));
    });
  });

  return result;
};
