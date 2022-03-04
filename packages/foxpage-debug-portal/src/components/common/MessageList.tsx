import React from 'react';

import { List, Typography } from 'antd';

const { Text } = Typography;

export interface MessagesProps {
  messages: string[];
}

const MessageList: React.FC<MessagesProps> = ({ messages }) => {
  return (
    <List
      dataSource={messages}
      bordered
      renderItem={item => (
        <List.Item>
          <Text>{item}</Text>
        </List.Item>
      )}
    />
  );
};

export default MessageList;
