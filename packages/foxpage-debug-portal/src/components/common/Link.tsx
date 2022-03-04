import React from 'react';

import { LinkOutlined } from '@ant-design/icons';
import { Typography } from 'antd';

export interface LinkProps {
  href: string;
  newTab?: boolean;
  icon?: React.ReactElement | boolean;
  title?: string | number;
  target?: string;
  style?: React.CSSProperties;
  type?: 'primary';
}

const { Text } = Typography;
const mapColor: Record<Required<LinkProps>['type'], string> = {
  primary: '#1890ff',
};

const Link: React.FC<LinkProps> = ({ href, icon = false, target, newTab = true, title, style = {}, type }) => {
  style['marginRight'] = style['marginRight'] || 6;
  return (
    <a style={style} href={href} target={target || (newTab ? '_blank' : undefined)}>
      {icon && (icon === true ? <LinkOutlined /> : icon)}
      {title && <Text style={{ color: type && mapColor[type] }}>{title}</Text>}
    </a>
  );
};

export default Link;
