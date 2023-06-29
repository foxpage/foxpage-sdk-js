import { Mock, MockItem } from '@foxpage/foxpage-types';

import { ContentDetailInstance } from '../common';

/**
 * mock instance
 *
 * @export
 * @class Mock
 */
export class MockInstance extends ContentDetailInstance<MockItem> implements Mock {
  readonly type = 'mock';

  constructor(data: Mock) {
    super(data);
  }
}
