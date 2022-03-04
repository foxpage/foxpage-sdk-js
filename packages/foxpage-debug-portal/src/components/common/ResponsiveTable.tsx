import React, { PropsWithChildren } from 'react';

import { Table } from 'antd';
import { TableProps } from 'antd/lib/table';

export interface ResponsiveTableProps<T> extends TableProps<T> {
  _some: null;
}

const ResponsiveTable = <T extends any>(props: PropsWithChildren<T>) => {
  return <Table scroll={{ y: 326, x: true }} size="middle" pagination={false} {...props} />;
};

export default ResponsiveTable;
