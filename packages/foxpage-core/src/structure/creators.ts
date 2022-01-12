import shortid from 'shortid';

import { FoxpageComponent, StructureNode } from '@foxpage/foxpage-types';

export function createStructureDSL(
  name: string,
  props: Record<string, any> = {},
  partial: Partial<StructureNode> = {},
) {
  const structure: StructureNode = {
    id: `create_${name}_${shortid()}`,
    props,
    type: 'react.component',
    name,
    version: '',
    ...partial,
  };
  return structure;
}

export function createStructureComponent(structure: StructureNode) {
  const component: FoxpageComponent = {
    name: structure.name,
    browserURL: '',
    debugURL: '',
    nodeURL: '',
    cssURL: '',
    supportSSR: true,
    meta: {},
  };
  return component;
}

export function createStructureWithFactory(
  factory: keyof React.ReactHTML | React.ComponentType<any>,
  props: Record<string, any> = {},
  partial: Partial<StructureNode> = {},
) {
  const label = typeof factory === 'string' ? factory : factory.displayName || 'Unknown';
  const group = typeof factory === 'string' ? 'tag' : 'builtin';
  const name = `${String(group)}.${label}`;

  const structure: StructureNode = createStructureDSL(name, {}, partial);
  structure.props = props;

  const component: FoxpageComponent = createStructureComponent(structure);
  component.factory = factory;

  return { structure, component };
}
