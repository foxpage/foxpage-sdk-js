import { StructureNode, Template } from '@foxpage/foxpage-types';

import { ContentDetailInstance } from '../common';

/**
 * template
 *
 * @export
 * @class Template
 */
export class TemplateInstance extends ContentDetailInstance<StructureNode> implements Template {
  readonly type = 'template';

  constructor(data: Template) {
    super(data);
  }
}
