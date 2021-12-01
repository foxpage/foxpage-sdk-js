import React, { FC, Fragment } from 'react';

import { HeadManager } from '../head-manager';

export const HeadConsumer: FC<{ manager: HeadManager }> = ({ manager }) => {
  const { jsURLList, cssURLList, preloadResources } = manager;
  const helmetComponents = manager.getHelmetData();
  return (
    <Fragment>
      {preloadResources.map(r => (
        <link key={r.href} rel="preload" href={r.href} as={r.as} />
      ))}
      {...helmetComponents}
      {[...cssURLList].map(uri => uri && <link key={uri} rel="stylesheet" href={uri} />)}
      {[...jsURLList].map(uri => uri && <script key={uri} src={uri} />)}
    </Fragment>
  );
};

HeadConsumer.displayName = 'HeadConsumer';
