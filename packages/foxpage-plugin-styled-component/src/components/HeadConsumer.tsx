import React, { FC, Fragment, ReactElement } from 'react';

export const HeadConsumer: FC<{ styleElements: ReactElement[] }> = ({ styleElements }) => {
  return <Fragment>{...styleElements}</Fragment>;
};

HeadConsumer.displayName = 'HeadConsumer';
