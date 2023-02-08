import { StructureNode } from '../structure';
import { VariableItem } from '../manager';

export interface NodePerformance {
  // node id
  id: string;
  // node type
  name: string;
  // node version
  version?: string;
  // total parse time
  parseTime?: number;
  // get initial props time
  initialPropsTime?: number;
  // structure build time
  buildTime?: number;
}

export interface VariablePerformance extends NodePerformance {}

export interface RenderPerformance {
  // base info
  appId?: string | number;
  templateId?: string;

  // all
  start?: number;
  end?: number;
  time?: number;

  // router
  // router match
  routerTime?: number;

  // get dsl
  getDSLTime?: number;
  // parse time
  parseTime?: number;
  // variable parse time
  variableTime?: number;
  // condition parse time
  conditionTime?: number;
  // structure parse time
  structureTime?: number;

  // component load
  componentLoadTime?: number;

  // render
  // build time
  buildTime?: number;
  // render time
  renderTime?: number;

  // structures node performance
  nodePerformance?: Record<string, NodePerformance>;
  // variable node performance
  variablePerformance?: Record<string, VariablePerformance>;
}

export type RecordPerformanceKey = keyof RenderPerformance;
export type PerformanceLogger = (
  key: keyof Pick<DSLPerformance, RecordPerformanceKey>,
  value?: string | StructureNode | Variable,
) => (msg?: string) => void;
