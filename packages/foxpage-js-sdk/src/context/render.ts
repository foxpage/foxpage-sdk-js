import _ from 'lodash';

import { ContextInstance } from '@foxpage/foxpage-shared';
import { Context, RenderAppInfo } from '@foxpage/foxpage-types';

/**
 * render context in browser
 *
 * @export
 * @class RenderContextInstance
 * @extends {RenderContextBase}
 * @implements {Context}
 */
export class RenderContextInstance extends ContextInstance implements Context {
  constructor(info: RenderAppInfo) {
    super(info);
  }
}
