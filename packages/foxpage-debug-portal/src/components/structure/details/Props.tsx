import React, { Fragment, useContext } from 'react';
import JsonView from 'react-json-view';

import { Typography } from 'antd';

import { SelectedContext } from '../../../context';

const { Text } = Typography;

// function isNotEmpty(obj?: Record<string, any>) {
//   return obj && Object.keys(obj).length > 0;
// }

const Props = () => {
  const current = useContext(SelectedContext);
  if (!current) {
    return <Text>please select structure.</Text>;
  }
  return (
    <Fragment>
      <JsonView
        src={current.props}
        collapsed={false}
        displayObjectSize={false}
        displayDataTypes={false}
        indentWidth={2}
      />
      {/* {isNotEmpty(current.props) && (
        <Fragment>
          <Divider />
          <Title level={4}>parsed props</Title>
          <JsonView
            src={current.props as any}
            displayObjectSize={false}
            displayDataTypes={false}
            indentWidth={2}
            collapsed={false}
          />
        </Fragment>
      )} */}
    </Fragment>
  );
};

export default Props;
