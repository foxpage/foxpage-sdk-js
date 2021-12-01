import React from 'react';
import { useEffect } from 'react';

import { init } from '../src/init';
import { initFramework, loadInitialState } from '../src/loaders';

import { getInitialData } from './data/initialState';

const config = {
  title: 'Page',
};

export default config;

const Wrapper: React.FC<{ data: any }> = ({ data }) => {
  useEffect(() => {
    if (data) {
      const initState = loadInitialState();
      console.log('-----------initState:', initState);
      const initPromiseChain: Promise<any> = Promise.resolve();
      initPromiseChain
        .then(() => initFramework(initState))
        .then(() => init(initState))
        .catch(error => {
          console.error('bootstrap fail.', error.stack);
        });
    }
  }, []);

  return (
    <>
      <div>hello csr entry</div>
      <div id="foxpage-app"></div>
      {data && (
        <script
          id="__foxpage_data__"
          type="application/json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/<\//g, '<\\/') }}
        />
      )}
    </>
  );
};

export const CSREntry = () => <Wrapper data={getInitialData()} />;
