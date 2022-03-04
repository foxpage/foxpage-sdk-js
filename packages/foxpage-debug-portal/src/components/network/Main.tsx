import React from 'react';

import { Typography } from 'antd';

import { getNetInfo } from '../../main';
import { Description } from '../common';

const { Title } = Typography;

const NetInfo = () => {
  const headers = getNetInfo();
  return (
    <div>
      <Title level={5}>request headers</Title>
      <Description data={headers} column={1} />
    </div>
  );
};

export default NetInfo;
