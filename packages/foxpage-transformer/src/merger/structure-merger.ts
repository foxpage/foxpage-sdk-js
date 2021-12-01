import { DSLStructure } from '../interface';

export enum MergeStrategy {
  replace = 1, // single matched replace(cover)
  replaceAll = 2, // all matched replace(cover). ignore structure
  combine = 3, // single matched merge
  combineAll = 4, // all matched merge. ignore structure
}

export enum MountNodeMergeStrategy {
  replace = 1, // The overall coverage
  combine = 2, // will be same MergeStrategy
}

export interface MergeOption {
  mergeStrategy?: MergeStrategy;
  mountNodeMergeStrategy?: MountNodeMergeStrategy;
}

export const isReplace = (value: MergeOption['mergeStrategy']) => {
  return value === MergeStrategy.replace || value === MergeStrategy.replaceAll;
};

export const isCombine = (value: MergeOption['mergeStrategy']) => {
  return value === MergeStrategy.combine || value === MergeStrategy.combineAll;
};

export const isMatch = (value: MergeOption['mergeStrategy']) => {
  return value === MergeStrategy.replace || value === MergeStrategy.combine;
};

export const isMatchAll = (value: MergeOption['mergeStrategy']) => {
  return value === MergeStrategy.replaceAll || value === MergeStrategy.combineAll;
};

export class StructureMerger {
  public status: 'pre' | 'matched' | 'merged' = 'pre';

  public readonly id?: string;

  public readonly type?: string;

  public structure: DSLStructure;

  public options: MergeOption;

  constructor(structureNode: DSLStructure, options: MergeOption) {
    this.id = structureNode.id;
    this.type = structureNode.type;
    this.structure = structureNode;
    this.options = options;
  }

  public isPred() {
    return this.status === 'pre';
  }

  public isMatched() {
    return this.status === 'matched';
  }

  public isMerged() {
    return this.status === 'merged';
  }

  public handleMatched() {
    this.status = 'matched';
  }
}
