const usePlugins = () => {
  const plugins = [
    '@foxpage/foxpage-plugin-react-render',
    '@foxpage/foxpage-plugin-visual-editor',
    '@foxpage/foxpage-plugin-debugger',
    '@foxpage/foxpage-plugin-parse-page',
    '@foxpage/foxpage-plugin-preview-page',
    '@foxpage/foxpage-plugin-debug-page',
    '@foxpage/foxpage-plugin-visual-html',
    '@foxpage/foxpage-plugin-render-mark',
  ];

  const commons = [
    '@foxpage/foxpage-plugin-function-parse',
    '@foxpage/foxpage-plugin-urlobj-parse',
    '@foxpage/foxpage-plugin-urlquery-parse',
    '@foxpage/foxpage-plugin-log',
  ];

  return {
    appPlugins: plugins,
    commonPlugins: commons,
  };
};

export { usePlugins };

export default usePlugins;
