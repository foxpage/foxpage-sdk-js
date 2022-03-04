import { StructureNode } from '@foxpage/foxpage-types';

import { mergeObject } from '../../utils';

const BLANK_NODE = 'system.inherit-blank-node'; // blank node

/**
 * merge structure node
 * @param base base node
 * @param current current node
 * @returns merged node
 */
export const combineNode = (base: StructureNode, current: StructureNode) => {
  const { props: baseProps, directive: baseDirective = {}, extension: baseExtension = {}, version, name, label } = base;
  const { props: currentProps, directive: currentDirective = {}, extension: currentExtension = {} } = current;
  const newNode: StructureNode = { ...current };
  if (!current.version) {
    newNode.version = version;
  }
  if (!current.label || current.label === BLANK_NODE) {
    newNode.label = label;
  }
  if (!current.name) {
    newNode.name = name;
  }

  // merge props
  newNode.props = mergeObject(baseProps, currentProps);

  // merge directive
  newNode.directive = mergeObject(baseDirective, currentDirective);

  // merge extension
  newNode.extension = mergeObject(baseExtension, currentExtension);

  return newNode;
};
