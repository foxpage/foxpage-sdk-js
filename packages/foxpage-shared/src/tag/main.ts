import _ from 'lodash';

import { Content, IsBaseTag, LocaleTag, PathnameTag, QueryTag, Tag, WeightTag } from '@foxpage/foxpage-types';

/**
 * generate tag with url info
 * @param queryString query string
 * @returns tags
 */
export const generateTagByQuerystring = (queryString: string) => {
  const searches = queryString.split('&');

  let localeTag: LocaleTag | undefined;
  const queryTag: QueryTag = {};

  searches.forEach(item => {
    const [key, value] = item.split('=');
    if (key === 'locale') {
      localeTag = {
        [key]: value,
        // status: true,
      };
    } else {
      if (!queryTag.query) {
        queryTag.query = {};
      }
      queryTag.query[key] = value;
    }
  });
  const tags: Tag[] = [];
  if (localeTag) {
    tags.push(localeTag);
  }
  if (queryTag.query) {
    tags.push(queryTag);
  }

  return tags;
};

/**
 * generate url by tags
 * @param tags tags
 */
export const generateQueryStringByTags = (tags: Tag[] = []) => {
  const locales: string[] = [];
  let queries = '';
  tags.forEach(tag => {
    // pathname tag
    // if ((tag as PathnameTag).pathname) {
    //   pathname = pathnameTagToString(tag as PathnameTag, false);
    // }
    // locale tag
    if ((tag as LocaleTag).locale) {
      locales.push(localeTagToString(tag as LocaleTag, false));
    }
    // query tag
    if ((tag as QueryTag).query) {
      queryTagToString(tag as QueryTag, false).forEach(item => {
        if (item) {
          queries = queries ? queries + '&' + item : item;
        }
      });
    }
  });
  if (locales.length > 0) {
    const strings: string[] = [];
    locales.forEach(locale => {
      if (locale) {
        strings.push(queries ? `${locale}&${queries}` : locale);
      }
    });
    return strings;
  }
  return queries ? [queries] : [];
};

/**
 * match content with tags
 * @param contents contents with tags
 * @param tags tags
 * @returns matched content
 */
export const matchContent = (contents: Content[], tags: Tag[] = []) => {
  const filtered =
    tags && tags.length > 0
      ? contents.filter(content => {
          const { generals: contentGenerals, locales: contentLocales, isBase } = tagsToStrings(content.tags);
          if (isBase) {
            return false;
          }

          const { generals, locales } = tagsToStrings(tags);
          const result =
            contentGenerals.findIndex(cTag => generals.indexOf(cTag) === -1) === -1 &&
            contentLocales.indexOf(locales[0]) > -1;
          return result;
        })
      : contents;

  // default select first
  // expend: return with weight
  if (filtered.length > 0) {
    return _.sortBy(
      _.sortBy(filtered, (item: Content) => item.createTime),
      (item: Content) => {
        const weightTag = item.tags.find(tag => !!(tag as WeightTag)?.weight);
        if (weightTag) {
          return (weightTag as WeightTag).weight;
        }
        return 0;
      },
    )[filtered.length - 1];
  }
  return null;
};

/**
 * tags to string
 * @param tags tags
 * @returns tag string ['pathname=test-a','locale=en_US', ...]
 */
function tagsToStrings(tags: Tag[]) {
  let strings: string[] = [];
  const locales: string[] = [];
  let isBase = false;
  tags.forEach(tag => {
    // pathname tag
    if ((tag as PathnameTag).pathname) {
      strings.push(pathnameTagToString(tag as PathnameTag));
    }
    // locale tag
    if ((tag as LocaleTag).locale) {
      locales.push(localeTagToString(tag as LocaleTag));
    }
    // query tag
    if ((tag as QueryTag).query) {
      strings = strings.concat(queryTagToString(tag as QueryTag));
    }
    // isBase tag
    if ((tag as IsBaseTag).isBase) {
      isBase = !!(tag as IsBaseTag).isBase;
    }
  });

  return {
    generals: strings.filter(item => !!item),
    locales: locales.filter(item => !!item),
    isBase,
  };
}

function pathnameTagToString(tag: PathnameTag, lowerCase = true) {
  const { pathname } = tag;
  return `pathname=${lowerCase ? lowerCaseString(pathname) : pathname}`;
}

function localeTagToString(tag: LocaleTag, lowerCase = true) {
  const locale = tag.locale.replace('_', '-');
  return `locale=${lowerCase ? lowerCaseString(locale) : locale}`;
}

function queryTagToString(tag: QueryTag, lowerCase = true) {
  const strings: string[] = [];
  const { query = {} } = tag as QueryTag;
  Object.keys(query).forEach(key => {
    const value = query[key];
    strings.push(`${lowerCase ? lowerCaseString(key) : key}=${lowerCase ? lowerCaseString(value) : value}`);
  });
  return strings;
}

function lowerCaseString(value: unknown) {
  return String(value).toLowerCase();
}
