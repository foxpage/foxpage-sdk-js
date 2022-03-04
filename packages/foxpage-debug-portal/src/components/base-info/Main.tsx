import React from 'react';

import { getInitialState } from '../../main';
import { Description } from '../common';

const BaseInfo = () => {
  const pageInfo = getInitialState()?.page || {};
  return <Description data={pageInfo} column={1} />;
};

export default BaseInfo;
