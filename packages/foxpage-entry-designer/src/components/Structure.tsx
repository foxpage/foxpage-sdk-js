import React, { ErrorInfo } from 'react';

import { RenderStructureNode } from '@foxpage/foxpage-client-types';
import { handlePostNodeRect, handleSelectNode } from '@foxpage/foxpage-iframe-actions';

import { StructureDetail } from '../interface';
import { generateStructurePropsStoreKey, transformListener } from '../listener';
import { NodesStore, States } from '../states';
import { store, StoreConsumer } from '../store';

import BlankNode from './BlankNode';
import WithErrorCatch from './WithErrorCatch';

// some Component need get children props,
// so Structure props is structure origin props
// our need data put in private "__detail" property
export interface StructureProps {
  [key: string]: any;
  __detail: StructureDetail;
}

interface StructureState {
  error?: Error;
  errorInfo?: ErrorInfo;
  propsFromStore: Record<string, any>;
}

export class Structure extends React.Component<StructureProps, StructureState> {
  structureRef = React.createRef<HTMLDivElement>();
  state: StructureState = {
    propsFromStore: {},
  };

  storeNamespace: string;
  propsFromListener: Record<string, any>;

  constructor(...args: [any]) {
    super(...args);
    const { props, node } = this.detail;

    this.propsFromListener = transformListener(props.__listeners);
    this.storeNamespace = generateStructurePropsStoreKey(node);
    store.subscribe(this.storeNamespace, this.handleStoreValue);
  }

  get detail() {
    return this.props.__detail;
  }

  handleStoreValue: StoreConsumer = (value: any) => {
    this.setState({
      propsFromStore: value,
    });
  };

  handleSelect = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();
    const { node } = this.detail;
    const domRect = document.getElementById(node.id)?.getBoundingClientRect();
    if (node && domRect) {
      States.setSelected(node);
      handleSelectNode(node as any);
      handlePostNodeRect(domRect);
    }
  };

  componentWillUnmount() {
    store.unsubscribe(this.storeNamespace, this.handleStoreValue);
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo });
    console.warn(`render node fail:`, this.detail.node, error, errorInfo);
  }

  render() {
    // handle error
    if (this.state.error) {
      return null;
    }

    const { children } = this.props;
    const { Component, initialProps, meta = {}, node } = this.detail;
    const { __editorConfig, id, name, type } = (node || {}) as unknown as RenderStructureNode;
    const { editable = false, visible = true, isTplNode = false } = __editorConfig || {};
    const componentMap = States.getComponentMap();
    const component = componentMap[name];
    const { enableChildren } = component || {};
    if (!visible) {
      return null;
    }

    const decoratorInfo = {
      id,
      'data-node-id': id,
      'data-node-name': name,
      'data-node-belong-template': !editable,
      'data-node': 'component',
      'data-node-drag-in': enableChildren && !isTplNode,
      ...(editable ? { onClick: this.handleSelect } : {}),
    };
    const mergeProps = {
      inDesigner: true,
      ...this.props,
      ...initialProps,
      ...this.propsFromListener,
      ...this.state.propsFromStore,
    };

    NodesStore.push({ detail: this.detail });

    if (meta.notRender) {
      return <BlankNode>{children}</BlankNode>;
    }

    const ele = meta.decorated ? (
      <Component {...mergeProps} $decorator={decoratorInfo}>
        {children}
      </Component>
    ) : (
      <div {...decoratorInfo}>
        <Component {...mergeProps}>{children}</Component>
      </div>
    );

    return <WithErrorCatch componentId={id} componentName={name} componentType={type} componentNode={ele} />;
  }
}
