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
</body>
</html>`;

/**
 * register router
 * @returns route
 */
export const handleRegisterRouter = async () => {
  return {
    pathname: 'foxpage-visual-editor.html',
    action: (_ctx: Context) => {
      const result = html.replace(
        '$link',
        'http://unpkg.com/@foxpage/foxpage-visual-editor@latest/dist/main.bundle.js', // always use the latest version
      );
      return result;
    },
  } as Route;
};
