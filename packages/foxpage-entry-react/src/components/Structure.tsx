import React, { ErrorInfo } from 'react';

import { BrowserStructure, FoxpageComponentMeta } from '@foxpage/foxpage-types';

import { generateStructurePropsStoreKey, transformListener } from '../listener';
import { store, StoreConsumer } from '../store';

export interface StructureDetail {
  node: BrowserStructure;
  meta: FoxpageComponentMeta | undefined;
  mod?: null | Record<string, any>;
  Component: React.ComponentType<any>;
  props: BrowserStructure['props'];
  initialProps?: Record<string, any>;
  injectProps?: Record<string, any>;
}

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
    const { Component, props, injectProps } = this.detail;

    const mergeProps = {
      ...injectProps,
      ...props,
      ...this.propsFromListener,
      ...this.state.propsFromStore,
    };

    // @ts-ignore
    return <Component {...mergeProps}>{children}</Component>;
  }
}
