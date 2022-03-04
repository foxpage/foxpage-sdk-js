import React from 'react';

import { Tabs } from 'antd';
import styled from 'styled-components';

import { BaseInfo, Directive, Message, PropsInfo } from './details';

const { TabPane } = Tabs;

const Container = styled.div`
  padding-left: 24px;
`;

const PanelContainer = styled.div`
  padding-right: 24px;
  padding-bottom: 24px;
`;

const Tab = () => {
  return (
    <Container>
      <Tabs tabPosition="top">
        <TabPane tab="Base" key="base">
          <PanelContainer>
            <BaseInfo />
          </PanelContainer>
        </TabPane>
        <TabPane tab="Props" key="props">
          <PanelContainer>
            <PropsInfo />
          </PanelContainer>
        </TabPane>
        <TabPane tab="Directive" key="directive">
          <PanelContainer>
            <Directive />
          </PanelContainer>
        </TabPane>
        <TabPane tab="Messages" key="messages">
          <PanelContainer>
            <Message />
          </PanelContainer>
        </TabPane>
        {/* <TabPane tab="Origin" key="origin">
          <PanelContainer>
            <OriginInfo />
          </PanelContainer>
        </TabPane> */}
        <TabPane tab="Hooks" key="hooks">
          <PanelContainer>coming soon ~</PanelContainer>
        </TabPane>
        <TabPane tab="Performance" key="performance">
          <PanelContainer>coming soon ~</PanelContainer>
        </TabPane>
      </Tabs>
    </Container>
  );
};

export default Tab;
