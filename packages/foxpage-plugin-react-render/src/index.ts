import { renderToHtml } from '@foxpage/foxpage-engine-react';
import { FoxpagePlugin } from '@foxpage/foxpage-plugin';
import { Context, FoxpageHooks } from '@foxpage/foxpage-types';

/**
 * defined react render plugin
 * @returns react render
 */
const reactRender = (): FoxpagePlugin<FoxpageHooks> => {
  return {
    visitor: {
      afterContextCreate: (ctx: Context) => {
        ctx.render = renderToHtml;
      },
    },
  };
};

export default reactRender;
