import React, { useContext } from 'react';

import { Descriptions, Typography } from 'antd';

import { SelectedContext } from '../../../context';
import { getComponentVersionMap } from '../../../main';

const { Item } = Descriptions;
const { Text } = Typography;

function BaseInfo() {
  const selected = useContext(SelectedContext);
  if (!selected) {
    return <Text>please select structure.</Text>;
  }
  const nameVersions = getComponentVersionMap();
  return (
    <Descriptions bordered column={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 1 }}>
      <Item label="Id">
        <Text>{selected?.id}</Text>
      </Item>
      <Item label="Label">
        <Text>{selected?.label}</Text>
      </Item>
      <Item label="Name">
        <Text>{selected?.name}</Text>
      </Item>
      <Item label="Version">
        <Text>{nameVersions[selected?.name || ''] || ''}</Text>
      </Item>
      {/* <Item label="Type">
        <Text>{selected?.type}</Text>
      </Item>
      <Item label="Show status">
        <Text>{selected?.show || 'true'}</Text>
      </Item> */}
    </Descriptions>
  );
}

export default BaseInfo;
