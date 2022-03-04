import React from 'react';
import JsonView from 'react-json-view';

import { Typography } from 'antd';
import { ColumnProps } from 'antd/lib/table';

import { VariableItem } from '@foxpage/foxpage-types';

import { getDebugState, getVariables } from '../../main';
import { ResponsiveTable } from '../common';

const isOnline = true;
const { Text } = Typography;

export interface ValuedVariable extends VariableItem {
  value: any;
}

function percent(size: number) {
  if (isOnline) {
    return `${size}%`;
  }
  return undefined;
}

const Value: React.FC<{ item?: ValuedVariable }> = ({ item }) => {
  const val = item?.value;
  if (val) {
    if (typeof val === 'string') {
      return <Text>{val}</Text>;
    }
    return (
      <JsonView
        src={val}
        collapsed
        name={false}
        displayObjectSize={false}
        displayDataTypes={false}
        indentWidth={2}
      ></JsonView>
    );
  }
  return null;
};

const Variables = () => {
  const variables = getVariables();
  const values = getDebugState()?.variableValue || {};

  if (!variables || !variables.length) {
    return <Text>no variables</Text>;
  }
  const dataSource: ValuedVariable[] = variables.map(item => {
    const { name, type, props } = item.schemas[0];
    const value = values[name];
    return { id: item.id, name, type, props, value: value ? value : '' + value };
  });

  const columns: ColumnProps<ValuedVariable>[] = [
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
      dataIndex: 'type',
      width: percent(8),
    },
    {
      key: 'value',
      title: 'value',
      width: percent(25),
      render: (_text, item) => {
        return <Value item={item} />;
      },
    },
    {
      key: 'props',
      title: 'props',
      width: percent(25),
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
    //   width: percent(14),
    //   render: (_text, item) => {
    //     const msg = item?;
    //     if (msg?.length) {
    //       return <MessageList messages={msg}></MessageList>;
    //     }
    //     return null;
    //   },
    // },
  ];
  return <ResponsiveTable rowKey="id" dataSource={dataSource} columns={columns} />;
};

export default Variables;
