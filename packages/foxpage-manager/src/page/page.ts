import { Page, StructureNode } from '@foxpage/foxpage-types';

import { ContentDetailInstance } from '../common';

/**
 * page
 *
 * @export
 * @class Page
 */
export class PageInstance extends ContentDetailInstance<StructureNode> implements Page {
  readonly type = 'page';

  constructor(data: Page) {
    super(data);
  }
}
