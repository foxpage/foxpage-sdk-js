const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const { join } = require('path');

const ROOT = join(process.cwd());
const FOXPAGE_ROOT_DIR = '@foxpage';

/**
 *
 * @param {string} pkgName
 * @param {string} outputName
 */
function _npmModuleWebpackEntry(pkgName, outputName = pkgName, _entry) {
  const resolvePath = require.resolve(pkgName);
  let pkgRootDirPath = '';

  const localMark = join('foxpage-sdk-js', 'packages');
  const inFoxpageProjectLocal = resolvePath.indexOf(localMark) > -1;
  if (inFoxpageProjectLocal) {
    // for local foxpage lerna project
    const localPkgName = pkgName.replace(`${FOXPAGE_ROOT_DIR}/`,'');
    pkgRootDirPath = resolvePath.slice(0, resolvePath.indexOf(localPkgName) + localPkgName.length);
  } else {
    const list = pkgName.split('/');
    const realPkgName = join(...list);
    pkgRootDirPath = resolvePath.slice(0, resolvePath.indexOf(realPkgName) + realPkgName.length);
  }

  const entryFile = join(pkgRootDirPath, _entry);
  const entry = {
    [outputName]: entryFile,
  };
  return entry;
}

/**
 *
 * @param {string} pkgName
 */
const npmModuleWebpackConfig = (
  pkgName,
  {
    fileName = pkgName,
    library = pkgName,
    prod: isProd = process.env.NODE_ENV === 'production',
    entry: _entry = 'index.js',
  },
) => {
  const entry = _npmModuleWebpackEntry(pkgName, fileName, _entry);

  /** @type {import('webpack').Configuration} */
  const config = {
    context: ROOT,
    devtool: false,
    mode: isProd ? 'production' : 'development',
    entry,
    output: {
      path: join(ROOT, 'library'),
      publicPath: '',
      filename: isProd ? '[name].min.[contenthash].js' : '[name].[contenthash].js',
      libraryTarget: 'umd',
      library,
      umdNamedDefine: true,
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      symlinks: true,
    },
    externals: {
      react: 'react',
    },
    optimization: {
      sideEffects: true,
      minimize: !!isProd,
      minimizer: [
        new TerserPlugin({
          extractComments: false,
        }),
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        __DEV__: JSON.stringify(!isProd),
        'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : 'development'),
      }),
      // !isProd && new webpack.NamedModulesPlugin(),
    ].filter(Boolean),
  };
  return config;
};

module.exports = {
  npmModuleWebpackConfig,
};
