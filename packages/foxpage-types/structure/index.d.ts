import { Directive } from '../directive';
import { ComponentListeners } from '../listener';

export type StructureNodeType = 'react.component';

export type StructureNodeProps<T extends Record<string, any>> = T & {
  __listeners?: ComponentListeners;
};

/**
 * structure node
 *
 * @export
 * @interface StructureNode
 */
export interface StructureNode<P = any> {
  /**
   * structure node id
   *
   * @type {string}
   */
  id: string;
  /**
   * structure node name
   *
   * @type {string}
   */
  name: string;
  /**
   * structure node props
   *
   * @type {StructureNodeProps}
   */
  props: StructureNodeProps<P>;
  /**
   * structure node type
   *
   * @type {StructureNodeType}
   */
  type: StructureNodeType;
  /**
   * structure node children
   *
   * @type {StructureNode[]}
   */
  children?: StructureNode[];
  /**
   * directive defined
   *
   * @type {Directive}
   */
  directive?: Directive;
  /**
   * structure node version
   *
   * @type {string}
   */
  version?: string;
  /**
   * disable status
   *
   * @type {boolean}
   */
  disable?: boolean;
  /**
   * show status
   *
   * @type {boolean}
   */
  show?: boolean;
}



