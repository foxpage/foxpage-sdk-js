module.exports = (api) => {
  const presetEnvConfig = {
    useBuiltIns: false,
    // corejs: 3,
    modules: false,
    // debug: true,
    targets: {
      browsers: [
        "defaults",
        "IE 11"
      ],
    },
  };

  api.cache(false);

  return {
    presets: [
      [require('@babel/preset-env'), presetEnvConfig],
      require('@babel/preset-react'),
      require('@babel/preset-typescript'),
    ],
    plugins: [
      require('@babel/plugin-proposal-class-properties'),
      require('@babel/plugin-proposal-nullish-coalescing-operator'),
      require('@babel/plugin-proposal-optional-chaining'),
      [require('babel-plugin-import'), {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,   // or 'css'
      }],
    ],
  }
}
