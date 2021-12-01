import { ContentTag, Tag } from '@foxpage/foxpage-types';

/**
 * Foxpage tag
 *
 * @export
 * @class TagImpl
 */
export class TagInstance implements ContentTag {
  /**
   * tag matched page id
   *
   * @type {string}
   */
  pageId: string;
  /**
   * page content tags
   *
   * @type {Tag[]}
   */
  pageTags: Tag[];

  constructor(pageId: string, pageTags: Tag[] = []) {
    this.pageId = pageId;
    this.pageTags = pageTags;
  }
}
