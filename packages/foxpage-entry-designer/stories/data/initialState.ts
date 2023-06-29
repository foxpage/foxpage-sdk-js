const data = {
  root: 'stru_hsjjahuaTQsablm3',
  page: {
    appId: 'appl_EJlrKxog8TmgvLA',
    slug: '',
    pageId: 'cont_i8GinG3VthF8LUs',
  },
  modules: [
    {
      name: '@fox-design/react-html',
      url: 'https://www.unpkg.com/@fox-design/react-html@0.0.2/dist/umd/production.min.js',
    },
    {
      name: '@fox-design/react-body',
      url: 'https://www.unpkg.com/@fox-design/react-body@0.0.4/dist/umd/production.min.js',
    },
    {
      name: '@fox-design/react-container',
      url: 'https://www.unpkg.com/@fox-design/react-container@0.1.0/dist/umd/production.min.js',
    },
    {
      name: '@fox-design/react-text',
      url: 'https://www.unpkg.com/@fox-design/react-text@0.1.1/dist/umd/production.min.js',
    },
    {
      name: '@fox-design/react-csr-entry',
      url: 'https://www.unpkg.com/@fox-design/react-csr-entry@0.2.0/dist/umd/production.min.js',
    },
    {
      name: '@fox-design/react-csr-entry',
      url: 'https://www.unpkg.com/@fox-design/react-csr-entry@0.2.0/dist/umd/production.min.js',
    },
    {
      name: '@fox-design/react-container',
      url: 'https://www.unpkg.com/@fox-design/react-container@0.1.0/dist/umd/production.min.js',
    },
    {
      name: '@fox-design/react-text',
      url: 'https://www.unpkg.com/@fox-design/react-text@0.1.1/dist/umd/production.min.js',
    },
  ],
  structures: [
    {
      id: 'stru_awjdoeFyoQ4eNK6-',
      name: '@fox-design/react-text',
      props: {
        text: 'template-text2',
      },
      childrenIds: [],
    },
    {
      id: 'stru_mmuilrQNEjAeGBz',
      name: '@fox-design/react-container',
      childrenIds: ['stru_awjdoeFyoQ4eNK6-'],
    },
    {
      id: 'stru_scjuvn6TvK5cxAWK',
      name: '@fox-design/react-text',
      props: {
        text: '2',
      },
      childrenIds: [],
    },
    {
      id: 'stru_pebsruiG6JSR5pb',
      name: '@fox-design/react-container',
      childrenIds: ['stru_scjuvn6TvK5cxAWK'],
    },
    {
      id: 'stru_hsjjahuaTQsablm3',
      name: '@fox-design/react-csr-entry',
      props: {
        data: {
          a: 'a',
        },
        entryLink: {
          url: 'https://unpkg.com/@foxpage/foxpage-entry-react@0.1.8/dist/entry.js',
        },
      },
      childrenIds: ['stru_pebsruiG6JSR5pb'],
    },
    {
      id: 'stru_rgvbzlPoNiEg7X5',
      name: '@fox-design/react-csr-entry',
      childrenIds: ['stru_hsjjahuaTQsablm3'],
    },
    {
      id: 'stru_xmbonnwEPSxW1Us',
      name: '@fox-design/react-body',
      childrenIds: ['stru_mmuilrQNEjAeGBz', 'stru_rgvbzlPoNiEg7X5'],
    },
    {
      id: 'stru_xeyqma5BO5ZqlW_',
      name: '@fox-design/react-html',
      childrenIds: ['stru_xmbonnwEPSxW1Us'],
    },
  ],
  resource: {},
  option: {
    renderMethod: 'hydrate',
  },
};

export const getInitialData = () => {
  return data;
};
