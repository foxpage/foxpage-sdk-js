import { Context, Route } from '@foxpage/foxpage-types';

const html = `<!doctype html>
<html lang="en" id="iframe-html">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>FoxPage Visual editor</title>
  <meta name="viewport"
    content="width=device-width, initial-scale=1, user-scalable=0, maximum-scale=1, minimum-scale=1">
</head>
<body>
  <script src="$link"></script>
  <script src="https://www.unpkg.com/requirejs@2.3.6/require.js"></script>
</body>
</html>`;

const COMMON_SUFFIX = '/_foxpage';

/**
 * register router
 * @returns route
 */
export const handleRegisterRouter = async () => {
  return {
    pathname: `${COMMON_SUFFIX}/visual-editor.html`,
    action: (ctx: Context) => {
      const { enable = true, url } = ctx.appConfigs?.visualEditor || {};
      if (!enable) {
        return 'Not found';
      }

      let realURL: string | undefined = '';

      if (typeof url === 'function') {
        realURL = url(ctx.request.req);
      } else {
        realURL = url;
      }

      if (realURL) {
        return html.replace('$link', realURL);
      }

      return html.replace(
        '$link',
        `${ctx.URL?.origin}${
          ctx.appConfigs?.virtualPath ? `/${ctx.appConfigs?.virtualPath}` : ''
        }${COMMON_SUFFIX}/static/visual-editor.js`,
      );
    },
  } as Route;
};
