const webpack = require('webpack');
const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
// @ts-ignore
const pkg = require('../package.json');
const FILE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];

module.exports = {
  context: path.resolve(__dirname),
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
    path: path.resolve(__dirname, '../dist'),
  },
  resolve: {
    extensions: FILE_EXTENSIONS,
    plugins: [
      // @ts-ignore
      new TsconfigPathsPlugin({
        configFile: path.join(__dirname, '../tsconfig.webpack.json'),
        extensions: FILE_EXTENSIONS,
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.(j|t)s(x)?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              configFile: path.resolve(__dirname, '../babel.config.js'),
            },
          },
        ],
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
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
};
