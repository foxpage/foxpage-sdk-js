import React from 'react';
import JsonView from 'react-json-view';

import { Typography } from 'antd';
import { ColumnProps } from 'antd/lib/table';

import { ConditionItem } from '@foxpage/foxpage-types';

import { getConditions, getDebugState } from '../../main';
import { ResponsiveTable } from '../common';

const { Text } = Typography;
const isOnline = true;

export interface ValuedConditionItem extends Omit<ConditionItem, 'children'> {
  value: any;
}

function percent(size: number) {
  if (isOnline) {
    return `${size}%`;
  }
  return undefined;
}

const Conditions = () => {
  const conditions = getConditions();
  const values = getDebugState()?.conditionValue || {};

  if (!conditions.length) {
    return <Text>no conditions</Text>;
  }
  const dataSource: ValuedConditionItem[] = conditions.map(item => {
    const { children, name, type, props } = item.schemas[0];
    const value = values[item.id];
    return { id: item.id, name, type, props: { children, ...props }, value: String(value) };
  });
  const columns: ColumnProps<ValuedConditionItem>[] = [
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
    {
      key: 'type',
      title: 'type',
      width: percent(30),
      render: value => (value === 1 ? 'And' : 'Or'),
    },
    {
      key: 'value',
      title: 'value',
      width: percent(30),
      render: (_text, item) => {
        return <Text>{String(item.value)}</Text>;
      },
    },
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

export default Conditions;
