import React, { useState } from 'react';

import { Button } from 'antd';
import styled from 'styled-components';

import Drawer from './Drawer';

const Tool = styled.div`
  position: fixed;
  bottom: 50px;
  right: 50px;
  z-index: 100000;
`;

const App = () => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Tool>
        <Button type="primary" onClick={() => setVisible(true)}>
          Open debugger
        </Button>
      </Tool>
      <Drawer visible={visible} onClose={() => setVisible(false)} />
    </>
  );
};

export default App;
