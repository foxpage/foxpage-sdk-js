import React, { ReactNode } from 'react';

import { Descriptions, Typography } from 'antd';
import { DescriptionsProps } from 'antd/es/descriptions';

const { Item } = Descriptions;
const { Text } = Typography;

export interface DescriptionProps<T extends any = Record<string, string>> extends DescriptionsProps {
  data: T;
  getLabel?: (key: string, val: string) => string;
  getText?: (val: string, key: string) => ReactNode;
  keys?: Array<keyof T>;
  showNill?: boolean;
}

const Description = <T extends Record<string, any> = Record<string, string>>({
  data,
  keys = Object.keys(data),
  getLabel = k => k,
  getText = v => v,
  showNill = false,
  ...restProps
}: DescriptionProps<T>) => {
  return (
    <Descriptions bordered column={{ xs: 1, sm: 1, md: 1, lg: 2, xl: 2, xxl: 2 }} size={'default'} {...restProps}>
      {keys.map(key => {
        const val: unknown = data[key];
        if ((!val && !showNill) || typeof val === 'object' || typeof key !== 'string') {
          return null;
        }
        const strValue = String(val);
        return (
          <Item key={key} label={getLabel(key, strValue)}>
            <Text>{getText(strValue, key)}</Text>
          </Item>
        );
      })}
    </Descriptions>
  );
};

export default Description;
