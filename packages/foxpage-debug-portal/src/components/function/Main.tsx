import React from 'react';
import JsonView from 'react-json-view';

import { Typography } from 'antd';
import { ColumnProps } from 'antd/lib/table';

import { FPFunctionItem } from '@foxpage/foxpage-types';

import { getFunctions } from '../../main';
import { ResponsiveTable } from '../common';

const { Text } = Typography;
const isOnline = true;

function percent(size: number) {
  if (isOnline) {
    return `${size}%`;
  }
  return undefined;
}

const Functions = () => {
  const functions = getFunctions();
  if (!functions.length) {
    return <Text>no functions</Text>;
  }

  const dataSource = functions.map(item => ({ id: item.id, ...item.schemas[0] }));
  const columns: ColumnProps<FPFunctionItem>[] = [
    {
      key: 'id',
      title: 'id',
      dataIndex: 'id',
      width: percent(10),
    },
    {
      key: 'name',
      title: 'name',
      dataIndex: 'name',
      width: percent(10),
    },
    // {
    //   key: 'value',
    //   title: 'value',
    //   width: percent(30),
    //   render: (_text, item) => {
    //     return <Text>{String(item.value)}</Text>;
    //   },
    // },
    {
      key: 'props',
      title: 'props',
      width: percent(30),
      render: (_text, item) => {
        const props = item?.props;
        if (props) {
          return (
            <JsonView
              src={props}
              collapsed
              name={false}
              displayObjectSize={false}
              displayDataTypes={false}
              indentWidth={2}
            ></JsonView>
          );
        }
        return null;
      },
    },
    // {
    //   key: 'messages',
    //   title: 'messages',
    //   width: percent(20),
    //   render: (_text, item) => {
    //     const msg = item?.messages;
    //     if (msg?.length) {
    //       return <MessageList messages={msg}></MessageList>;
    //     }
    //     return null;
    //   },
    // },
  ];
  return <ResponsiveTable rowKey="id" dataSource={dataSource} columns={columns} />;
};

export default Functions;
