import React from 'react';

import { Tabs } from 'antd';
import styled from 'styled-components';

import { BaseInfo, Components, Conditions, Functions, NetInfo, Structures, Variables } from './components';

const { TabPane } = Tabs;

const Container = styled.div`
  .ant-tabs-content {
    height: 100%;
  }
  div[id='root-tab'] {
    height: 378px;
  }
`;

const PanelContainer = styled.div`
  padding-top: 12px;
  padding-right: 24px;
  height: 100%;
  overflow: auto;
`;

const Tab = () => {
  return (
    <Container>
      <Tabs id="root-tab" tabPosition="left" type="card" defaultActiveKey="structures">
        <TabPane tab="Base Info" key="baseInfo">
          <PanelContainer>
            <BaseInfo />
          </PanelContainer>
        </TabPane>
        <TabPane tab="Structures" key="structures">
          <Structures />
        </TabPane>
        {/* <TabPane tab="Page" key="page">
          <PanelContainer>coming soon ~</PanelContainer>
        </TabPane>
        <TabPane tab="Template" key="template">
          <PanelContainer>coming soon ~</PanelContainer>
        </TabPane> */}
        <TabPane tab="Variables" key="variable">
          <PanelContainer>
            <Variables />
          </PanelContainer>
        </TabPane>
        <TabPane tab="Conditions" key="conditions">
          <PanelContainer>
            <Conditions />
          </PanelContainer>
        </TabPane>
        <TabPane tab="Functions" key="functions">
          <PanelContainer>
            <Functions />
          </PanelContainer>
        </TabPane>
        <TabPane tab="Components" key="components">
          <PanelContainer>
            <Components />
          </PanelContainer>
        </TabPane>
        <TabPane tab="Network Info" key="networkInfo">
          <PanelContainer>
            <NetInfo />
          </PanelContainer>
        </TabPane>
        <TabPane tab="Performance" key="performance">
          <PanelContainer>coming soon ~</PanelContainer>
        </TabPane>
      </Tabs>
    </Container>
  );
};

export default Tab;
