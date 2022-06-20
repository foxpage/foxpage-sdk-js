/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require('webpack');
const { merge } = require('webpack-merge');

const path = require('path');
const webpackBaseConfig = require('./webpack.base.config');

const PORT = 3003;

module.exports = merge(webpackBaseConfig, {
  cache: true,
  devtool: 'inline-source-map',
  mode: 'development',
  entry: {
    main: [
      `webpack-dev-server/client?http://0.0.0.0:${PORT}`,
      'webpack/hot/only-dev-server',
      path.join(__dirname, '../src/index.ts'),
    ],
  },

  devServer: {
    contentBase: path.join(__dirname, '../src'), // Relative directory for base of server
    hot: true, // Live-reload
    inline: true,
    port: 3003, // Port Number
    host: '0.0.0.0', // Change to '0.0.0.0' for external facing server
  },

  module: {
    rules: [
      {
        test: /\.(jpg|gif|png)$/,
        loader: 'file-loader',
      },
    ],
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      __DEV__: "true"
    }),
  ],
});
