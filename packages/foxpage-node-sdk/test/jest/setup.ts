jest.mock('@foxpage/foxpage-core', () => {
  return {
    parser: {
      parse: async () => {
        return '';
      },
    },
  };
});
