import { Page, StructureNode } from '@foxpage/foxpage-types';

import { ContentDetailInstance } from '../common';

/**
 * page
 *
 * @export
 * @class Page
 */
export class PageInstance extends ContentDetailInstance<StructureNode> implements Page {
  constructor(data: Page) {
    super(data);
  }
}
