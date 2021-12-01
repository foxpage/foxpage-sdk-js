import { createElement, HTMLAttributes, ReactHTML } from 'react';

type InferProps<T> = T extends (props: infer R) => any ? R : any;

export interface InnerHTMLProps<T extends keyof ReactHTML = 'div'> {
  html?: string;
  tag: T;
  tagProps?: InferProps<ReactHTML[T]>;
}

export const InnerHTML = <T extends keyof ReactHTML = 'div'>({ html, tag, tagProps = {} }: InnerHTMLProps<T>) => {
  const props: HTMLAttributes<any> = {
    ...tagProps,
  };
  if (html) {
    props.dangerouslySetInnerHTML = {
      __html: html,
    };
  }
  return createElement(tag, props);
};

InnerHTML.displayName = 'InnerHTML';
