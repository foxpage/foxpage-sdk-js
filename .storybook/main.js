const path = require('path');

// Export a function. Accept the base config as the only param.
module.exports = {
  stories: [
    "../packages/**/stories/**/*.stories.mdx",
    "../packages/**/stories/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    // Make whatever fine-grained changes you need
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            configFile: path.resolve(__dirname, '../packages/foxpage-entry-react/babel.config.js'),
          },
        },
      ],
    });
    config.resolve = {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    }
    // Return the altered config
    return config;
  },
};
