/**
 * framework lib configs
 * TODO: will be config by app
 */
export const frameworkResources = {
  requirejsLink: 'https://www.unpkg.com/requirejs@2.3.6/require.js',
  libs: {
    react: {
      url: 'https://www.unpkg.com/react@16.14.0/umd/react.production.min.js',
      injectWindow: 'React',
      umdModuleName: 'react',
    },
    'react-dom': {
      url: 'https://www.unpkg.com/react-dom@16.14.0/umd/react-dom.production.min.js',
      injectWindow: 'ReactDOM',
      umdModuleName: 'react-dom',
    },
    'react-helmet': {
      url: 'https://www.unpkg.com/react-helmet@6.1.0/lib/Helmet.js',
      injectWindow: 'Helmet',
      umdModuleName: 'react-helmet',
    },
  },
};
