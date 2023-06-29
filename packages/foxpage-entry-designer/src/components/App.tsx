import React from 'react';

import { createGlobalStyle, StyleSheetManager } from 'styled-components';

import { AppComponentProps } from '../interface';
import { States } from '../states';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0 !important;
  }
  ::-webkit-scrollbar-track {
    background-color: #f5f5f5;
  }

  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  ::-webkit-scrollbar-thumb {
    box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.15);
    background-color: #dbdbdb;
    border-radius: 8px;
  }
  *[data-node="component"] {
    outline: ${(props: { gridMode: string }) => (props.gridMode === 'all' ? '1px dashed #cccccc' : 'none')};
    outline-offset: -2px;
    cursor: pointer;
    &.hovered {
      outline-offset: -2px;
      outline: 2px solid #1890ff;
    }

    &.has-wrapper{
      outline: none;
      pointer-events: none;
    }
  }
  *[data-node-wrapper]{
    outline: none;
    &:hover{
      outline: none;
    }
  }
  *[data-node-belong-template="true"] {
    outline: none;
  }
  *[data-node-drag-in="true"]:empty:before,
  *[data-node-drag-in="true"]>div:empty:before {
    display: flex;
    content: '+';
    display: flex;
    font-size: 14px;
    line-height: 1.5;
    align-items: center;
    justify-content: center;
    padding: 20px 16px;
  }
  *[data-node-type="system.root-container"]>div:empty {
    outline: none;
  }
  *[data-node-type="system.root-container"]>div:empty:before {
    content: '';
  }
  body: {
    transform: scale(${States.getZoom()})
  };
`;

export const App: React.FC<AppComponentProps> = ({ children }) => {
  return (
    <StyleSheetManager target={window.head}>
      <>
        {
          //@ts-ignore
          <GlobalStyle gridMode="all" />
        }
        {children}
      </>
    </StyleSheetManager>
  );
};
