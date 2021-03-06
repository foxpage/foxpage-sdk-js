import { Route } from '@foxpage/foxpage-types';

const html = `<!doctype html>
<html lang="en" id="iframe-html">
<head id="iframe-head">
    <title>foxpage visual html</title>
    <style>
        html,
        body {
            height: 100%;
        }

        body {
            margin: 0;
            padding: 0;
        }

        #mount-point {
            height: 100%;
        }

        ::-webkit-scrollbar-track {
            background-color: #f5f5f5;
        }

        ::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }

        ::-webkit-scrollbar-thumb {
            box-shadow: inset 0 0 3px rgba(0, 0, 0, .15);
            background-color: #dbdbdb;
            border-radius: 8px;
        }
        img {
          vertical-align: middle;
          border-style: none;
        }
    </style>
</head>

<body id="iframe-body">
    <div id="mount-point" style="height: 100%;"></div>
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
    pathname: `${COMMON_SUFFIX}/environment.html`,
    action: () => {
      return html;
    },
  } as Route;
};
