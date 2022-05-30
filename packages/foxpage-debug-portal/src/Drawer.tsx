import React from 'react';

import { Button, Drawer as AntdDrawer, Space } from 'antd';

import Tabs from './Tabs';

const Drawer = (props: { visible?: boolean; onClose: () => void }) => {
  const { visible = false, onClose } = props;

  return (
    <AntdDrawer
      title="Debugger"
      placement="bottom"
      height={450}
      closable={false}
      onClose={onClose}
      visible={visible}
      extra={
        <Space>
          <Button onClick={onClose}>Close</Button>
        </Space>
      }
      bodyStyle={{ padding: '2px 0 0 0' }}
    >
      <Tabs />
    </AntdDrawer>
  );
};

export default Drawer;
