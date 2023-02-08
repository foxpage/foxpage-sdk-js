const webpack = require('webpack');
const { join } = require('path');
const rm = require('rimraf');
// const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const pkg = require('../package.json');

const ROOT = join(__dirname, '..');
const DIST_DIR = join(ROOT, 'dist');

const FILE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];

const webpackConfig = (isBuildProd, {
  isLocal = false,
} = {}) => {
  const baseExternals = {
    // 'react': 'React',
    // 'react-dom': 'ReactDOM',
  };

  /** @type {import('webpack').Configuration} */
  const config = {
    context: ROOT,
    devtool: false,
    mode: isBuildProd ? 'production' : 'development',
    entry: {
      entry: join(ROOT, 'src', 'index.ts'),
    },
    output: {
      path: DIST_DIR,
      publicPath: '',
      filename: isBuildProd ? 'debug.min.js' : 'debug.js',
    },
    resolve: {
      extensions: FILE_EXTENSIONS,
      symlinks: true,
      alias: {
        'antd/lib/table$': require.resolve('antd/es/table'),
      },
      // plugins: [
      //   // @ts-ignore
      //   new TsconfigPathsPlugin({
      //     configFile: join(__dirname, '../tsconfig.webpack.json'),
      //     extensions: FILE_EXTENSIONS,
      //   }),
      // ],
    },
    externals: isBuildProd ? baseExternals : [
      baseExternals,
      {
        moment: 'moment',
      },
    ],
    optimization: {
      sideEffects: true,
      minimize: isLocal ? false : !!isBuildProd,
      // moduleIds: "named",
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx|js|jsx)$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
        {
          test: /\.(less)$/,
          use: [
            'style-loader',
            'css-loader',
            {
              loader: 'less-loader',
              options: {
                javascriptEnabled: true
              }
            }
          ],
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        __DEV__: JSON.stringify(!isBuildProd),
        __APP_VERSION__: JSON.stringify(pkg.version),
        'process.env.NODE_ENV': JSON.stringify(isBuildProd ? 'production' : 'development'),
      }),
      // !isBuildProd && new webpack.NamedModulesPlugin(),
    ].filter(Boolean),
  };
  return config;
};

function rmDist() {
  rm.sync(DIST_DIR + '/**', {
    glob: {
      ignore: [
        join(DIST_DIR),
      ],
    },
  });
}

const needAnalyze = process.env.ANALYZE;
const isDev = process.env.NODE_ENV === 'development';
const isBuildProduction = process.env.NODE_ENV === 'production';

if (needAnalyze) {
  module.exports = webpackConfig(true, { analyze: true });
} else if (isBuildProduction) {
  rmDist();
  module.exports = [webpackConfig(false), webpackConfig(true)];
} else if (isDev) {
  module.exports = webpackConfig(false, { isLocal: true });
} else {
  throw new Error('not match env');
}
