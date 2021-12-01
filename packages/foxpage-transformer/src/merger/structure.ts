import shortid from 'shortid';

import { DSLStructure } from '../interface';

import { concatUsedConditionsById } from './utils/condition';
import { concatUsedVariablesById } from './utils/variables';
import { combineProps, replaceProps } from './props';
import { matchAllStructureById, matchAllStructureByType, matchStructureByType } from './structure-matcher';
import { isMatch, isReplace, MergeOption, MountNodeMergeStrategy, StructureMerger } from './structure-merger';

export const DYNAMIC_MOUNT_NODE = 'system.dynamic-mount-node';

interface MergerOpt extends MergeOption {
  enableTopLevelMatch?: boolean;
}

export const buildPreMergeStructures = (rootNodes: DSLStructure[], options: MergeOption) => {
  return rootNodes.map(node => new StructureMerger(node, options));
};

const setStructureId = (rootNodes: DSLStructure[]) => {
  const r = (_list: DSLStructure[]) => {
    for (let i = 0; i < _list.length; i++) {
      const item = _list[i];
      if (!item.id) {
        item.id = `sdk_init_${shortid()}`;
      }
      if (item.children && item.children?.length > 0) {
        r(item.children);
      }
    }
  };

  r(rootNodes);
};

const classifyStructures = (structures: StructureMerger[] = []) => {
  const structuresWithId: StructureMerger[] = [];
  const structuresWithType: StructureMerger[] = [];
  structures.forEach(item => {
    if (item.id) {
      structuresWithId.push(item);
    } else {
      structuresWithType.push(item);
    }
  });
  return { structuresWithId, structuresWithType };
};

const _combine = (merged: DSLStructure, matched: DSLStructure, children: DSLStructure[]) => {
  const {
    id,
    type,
    props: mergedProps = {},
    variables: mergedVariables = [],
    conditions: mergedConditions = [],
    ...mergedRest
  } = merged;
  const {
    props: matchedProps = {},
    variables: matchedVariables = [],
    conditions: matchedConditions = [],
    ...matchedRest
  } = matched;

  // merge variables & conditions
  const _mergedVariables = concatUsedVariablesById(mergedVariables, matchedVariables);
  const _mergedConditions = concatUsedConditionsById(mergedConditions, matchedConditions);

  return {
    ...mergedRest,
    ...matchedRest,
    id,
    type,
    props: combineProps(mergedProps, matchedProps),
    children: children || [],
    variables: _mergedVariables,
    conditions: _mergedConditions,
  } as DSLStructure;
};

const _replace = (merged: DSLStructure, matched: DSLStructure, children: DSLStructure[]) => {
  const { id, type, props: mergedProps = {}, ...mergedRest } = merged;
  const {
    props: matchedProps = {},
    variables: matchedVariables = [],
    conditions: matchedConditions = [],
    ...matchedRest
  } = matched;

  return {
    ...mergedRest,
    ...matchedRest,
    id,
    type,
    props: replaceProps(mergedProps, matchedProps),
    children: children || [],
    variables: matchedVariables,
    conditions: matchedConditions,
  } as DSLStructure;
};

const _merge = (
  staticStructure: DSLStructure,
  matchedStructure: DSLStructure,
  r: (_staticStructures: DSLStructure[], _dynamicStructures: DSLStructure[], opt?: MergerOpt) => DSLStructure[],
  options: MergerOpt,
) => {
  // is dynamic mount node
  if (staticStructure.type === DYNAMIC_MOUNT_NODE) {
    // is dynamic mount node
    const { mergeStrategy } = matchedStructure.props || {};
    const _mountNodeMergeStrategy =
      staticStructure.props?.mergeStrategy ||
      mergeStrategy ||
      options.mountNodeMergeStrategy ||
      MountNodeMergeStrategy.replace;

    // dynamic mount node merge strategy: replace
    if (_mountNodeMergeStrategy === MountNodeMergeStrategy.replace) {
      if (matchedStructure.children && matchedStructure.children?.length > 0) {
        setStructureId(matchedStructure.children);
      }
      return matchedStructure;
    }
  }

  // merge children
  const mergedChildren = r(staticStructure.children || [], matchedStructure.children || [], options);

  // replace
  if (isReplace(options.mergeStrategy)) {
    return _replace(staticStructure, matchedStructure, mergedChildren);
  }

  // combine
  return _combine(staticStructure, matchedStructure, mergedChildren);
};

/**
 * structure merge
 * @param staticStructures
 * @param dynamicStructures
 * @param options: {mergeStrategy?: MergeStrategy, mountNodeMergeStrategy?MountNodeMergeStrategy}
 */
export const structureMerge = (
  staticStructures: DSLStructure[] = [],
  dynamicStructures: DSLStructure[] = [],
  options: MergeOption,
) => {
  // At the top dynamic structure classify
  // classify the structures by id & type
  // id is exact match
  // type is match by MergeOption.strategy
  const preMergeStructures = buildPreMergeStructures(dynamicStructures, options);
  const { structuresWithId = [], structuresWithType = [] } = classifyStructures(preMergeStructures);

  const r = (_staticStructures: DSLStructure[] = [], _dynamicStructures: DSLStructure[] = [], opt?: MergerOpt) => {
    const _preMergeStructures = buildPreMergeStructures(_dynamicStructures, options);
    const { structuresWithId: _structuresWithId = [], structuresWithType: _structuresWithType = [] } =
      classifyStructures(_preMergeStructures);
    // cur level structures + top level structures
    const newStructuresWithId = _structuresWithId.concat(structuresWithId);
    const newStructuresWithType = _structuresWithType.concat(structuresWithType);

    const merged: DSLStructure[] = _staticStructures.map(item => {
      const { children, id, type } = item;

      let matches: StructureMerger[] = [];

      // match structure by id
      const matched = matchAllStructureById(newStructuresWithId, id);
      if (matched.length > 0) {
        matches = matched;
      }
      // will match structure by type
      if (isMatch(options.mergeStrategy)) {
        // match current level
        const curLevelMatched = matchStructureByType(_structuresWithType, type);
        if (curLevelMatched) {
          curLevelMatched.handleMatched(); // add matched tag
          matches.push(curLevelMatched);
        }

        if (opt?.enableTopLevelMatch) {
          // match top level
          const topLevelMatched = matchStructureByType(structuresWithType, type);
          if (topLevelMatched) {
            topLevelMatched.handleMatched(); // add matched tag
            matches.push(topLevelMatched);
          }
        }
      } else {
        matches = matches.concat(matchAllStructureByType(newStructuresWithType, type));
      }

      // do merge
      if (matches.length > 0) {
        let _newMerged: DSLStructure = item;
        const total = matches.length;
        matches.forEach((match, index) => {
          // add matched tag
          match.handleMatched();
          // enableTopLevelMatch: only latest one need match top structure
          _newMerged = _merge(_newMerged, match.structure, r, { ...options, enableTopLevelMatch: index === total - 1 });
        });
        return _newMerged;
      }

      // merge children
      if (children?.length && children.length > 0) {
        const mergedChildren = r(children, [], { enableTopLevelMatch: true });
        return {
          ...item,
          children: mergedChildren,
        };
      }

      return item;
    });

    return merged;
  };

  return r(staticStructures, [], { enableTopLevelMatch: true });
};
