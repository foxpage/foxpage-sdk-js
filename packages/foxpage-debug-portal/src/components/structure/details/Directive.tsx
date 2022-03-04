import React, { Fragment, useContext } from 'react';
import JsonView from 'react-json-view';

import { Typography } from 'antd';

import { SelectedContext } from '../../../context';

const { Text } = Typography;

const Directive = () => {
  const current = useContext(SelectedContext);
  if (!current) {
    return <Text>please select structure.</Text>;
  }
  return (
    <Fragment>
      <JsonView
        src={current.directive || {}}
        collapsed={false}
        displayObjectSize={false}
        displayDataTypes={false}
        indentWidth={2}
      />
    </Fragment>
  );
};

export default Directive;
