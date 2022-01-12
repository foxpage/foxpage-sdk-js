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
        // if (ctx.frameworkResource) {
        //   if (!ctx.frameworkResource.libs) {
        //     ctx.frameworkResource.libs = {};
        //   }
        //   ctx.frameworkResource.libs['react'] = {
        //     url: 'https://www.unpkg.com/react@16.14.0/umd/react.production.min.js',
        //     injectWindow: 'React',
        //     umdModuleName: 'react',
        //   };
        //   ctx.frameworkResource.libs['react-dom'] = {
        //     url: 'https://www.unpkg.com/react-dom@16.14.0/umd/react-dom.production.min.js',
        //     injectWindow: 'ReactDOM',
        //     umdModuleName: 'react-dom',
        //   };
        // }

        ctx.render = renderToHtml;
      },
    },
  };
};

export default reactRender;
