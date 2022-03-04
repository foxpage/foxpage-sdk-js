import React from 'react';
import JsonView from 'react-json-view';

import { ColumnProps } from 'antd/lib/table';

import { BrowserModule } from '@foxpage/foxpage-types';

import { getComponents } from '../../main';
import { Link, ResponsiveTable } from '../common';

// const { Text } = Typography;

// function filterBrowserUsedComponents(components: ComponentInfoType[]) {
//   const { modules } = loadInitialState();
//   return components.filter(comp => {
//     const { type: componentName } = comp;
//     const mod = modules.find(m => m.name === componentName);
//     return !!mod;
//   });
// }

const columns: ColumnProps<BrowserModule>[] = [
  {
    key: 'name',
    title: 'name',
    dataIndex: 'name',
  },
  {
    key: 'version',
    title: 'version',
    dataIndex: 'version',
  },
  {
    key: 'url',
    title: 'url',
    render: (_text, item) => {
      if (item.url) {
        return <Link href={item.url} title="production" newTab type="primary" />;
      }
      return '-';
    },
  },
  {
    key: 'deps',
    title: 'deps',
    render: (_text, item) => {
      const deps = item?.deps;
      if (deps) {
        return (
          <JsonView
            src={deps.length > 0 ? { deps } : {}}
            collapsed
            name={false}
            displayObjectSize={false}
            displayDataTypes={false}
            indentWidth={2}
          ></JsonView>
        );
      }
      return '-';
    },
  },
  {
    key: 'meta',
    title: 'meta',
    render: (_text, item) => {
      const meta = item?.meta;
      if (meta) {
        return (
          <JsonView
            src={meta}
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
  //   render: (_text, item) => {
  //     const msg = item?.messages;
  //     if (msg?.length) {
  //       return <MessageList messages={msg}></MessageList>;
  //     }
  //     return null;
  //   },
  // },
];

const Components = () => {
  // filter builtin components
  const components = getComponents()?.filter(item => item.name.indexOf('builtin') === -1);

  return (
    <div>
      <ResponsiveTable rowKey="name" dataSource={components} columns={columns} />
    </div>
  );
};

export default Components;
