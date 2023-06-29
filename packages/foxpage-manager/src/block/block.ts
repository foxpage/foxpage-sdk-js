import { Block, StructureNode } from '@foxpage/foxpage-types';

import { ContentDetailInstance } from '../common';

/**
 * block
 *
 * @export
 * @class Block
 */
export class BlockInstance extends ContentDetailInstance<StructureNode> implements Block {
  readonly type = 'block';

  constructor(data: Block) {
    super(data);
    this.type = 'block';
  }
}
