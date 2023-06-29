import { ContentDetail, ContentVersionType, Page, RelationInfo } from '@foxpage/foxpage-types';

import { ContentDetailInstance } from './content';

export type contentInitData = RelationInfo & { pages?: Page[] };

/**
 *
 * @param contents
 * @returns handled contents
 */
export const createContentInstance = <K extends keyof Omit<RelationInfo, 'sysVariables'> | 'pages'>(
  contents: contentInitData,
): contentInitData => {
  const result = {} as contentInitData;

  Object.keys(contents).forEach(key => {
    const keyStr = key as K;
    const type = key.substring(0, key.length - 1) as ContentVersionType;
    const list = contents[keyStr] as ContentDetail[];
    if (!result[keyStr]) {
      result[keyStr] = [];
    }
    list.forEach(item => {
      result[keyStr]?.push(new ContentDetailInstance<any>({ ...item, type }));
    });
  });

  return result;
};
