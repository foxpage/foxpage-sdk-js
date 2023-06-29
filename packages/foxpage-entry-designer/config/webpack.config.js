const webpack = require('webpack');
const path = require('path');
const rm = require('rimraf');

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CopyWebpackPlugin = require('copy-webpack-plugin');

const pkg = require('../package.json');

const ROOT = path.join(__dirname, '..');
const DIST_DIR = path.join(ROOT, 'dist');
const devServer = {
  port: 3005,
  // contentBasePublicPath: DIST_DIR,
  contentBase: DIST_DIR, // Relative directory for base of server
  hot: true, // Live-reload
  inline: true,
  host: 'localhost', // Change to '0.0.0.0' for external facing server
  disableHostCheck: true,
};

const webpackConfig = (isBuildProd, { analyze: needAnalyze = false, isLocal = false } = {}) => {
  const baseExternals = {
    react: 'React',
    'react-dom': 'ReactDOM',
    'react-helmet': 'Helmet',
  };

  /** @type {import('webpack').Configuration} */
  const config = {
    context: ROOT,
    devtool: false,
    mode: isBuildProd ? 'production' : 'development',
    entry: {
      entry: path.join(ROOT, 'src', 'entry.ts'),
    },
    devServer,
    output: {
      path: DIST_DIR,
      publicPath: isBuildProd ? '' : undefined,
      filename: isBuildProd ? 'designer.min.js' : 'designer.js',
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      symlinks: true,
    },
    externals: baseExternals,
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
            // {
            //   loader: 'less-loader',
            //   options: {
            //     javascriptEnabled: true,
            //   },
            // },
          ],
        },
      ],
    },
    plugins: [
      ...(isBuildProd
        ? []
        : [
            new CopyWebpackPlugin({
              patterns: [{ from: './src/index.html', to: 'index.html' }],
            }),
          ]),
      new webpack.DefinePlugin({
        __DEV__: JSON.stringify(!isBuildProd),
        __APP_VERSION__: JSON.stringify(pkg.version),
        'process.env.NODE_ENV': JSON.stringify(isBuildProd ? 'production' : 'development'),
      }),
      needAnalyze && new BundleAnalyzerPlugin(),
      // !isBuildProd && new webpack.NamedModulesPlugin(),
    ].filter(Boolean),
  };
  return config;
};

function rmDist() {
  rm.sync(DIST_DIR + '/**', {
    glob: {
      ignore: [path.join(DIST_DIR)],
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
