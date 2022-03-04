import React, { useContext } from 'react';
import JsonView from 'react-json-view';

import { Typography } from 'antd';

import { SelectedContext } from '../../../context';

const { Text } = Typography;

const Origin = () => {
  const current = useContext(SelectedContext);
  if (!current) {
    return <Text>please select structure.</Text>;
  }
  // TODO:
  return (
    <JsonView
      src={current.props}
      collapsed={false}
      displayObjectSize={false}
      displayDataTypes={false}
      indentWidth={2}
    />
  );
};

export default Origin;
