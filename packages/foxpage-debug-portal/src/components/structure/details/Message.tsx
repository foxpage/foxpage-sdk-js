import React, { useContext } from 'react';

import { Typography } from 'antd';

// import { MessageList } from '../../common';
import { SelectedContext } from '../../../context';

const { Text } = Typography;

const Messages = () => {
  const current = useContext(SelectedContext);
  if (!current) {
    return <Text>please select structure.</Text>;
  }
  // if (!current || !current.messages.length) {
  return <Text>no messages.</Text>;
  // }
  // return <MessageList messages={current.messages}></MessageList>;
};

export default Messages;
