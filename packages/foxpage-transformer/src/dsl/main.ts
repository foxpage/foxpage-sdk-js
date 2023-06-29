import { Page, StructureNode } from '@foxpage/foxpage-types';

import { DSLStructure, PageDSL } from '../interface';
import { merge, MergeOption, MergeStrategy } from '../merger';

export type SchemaRecord = Map<string, StructureNode>;

/**
 * transformer fox-open page to foxpage(old) page
 * @param page fox open page
 * @returns foxpage (old) page and schemaMap(for schema node backup)
 */
export const transformToOldDSL = (page: Page): { pageDSL: PageDSL; schemaMap: SchemaRecord } => {
  const { id, schemas } = page;
  const schemaMap = new Map<string, StructureNode>();

  const createStructure = (value: StructureNode): DSLStructure => {
    return {
      id: value.id,
      name: value.name,
      type: value.name,
      version: value.version || '',
      props: value.props || {},
      children: [],
      variables: [],
      conditions: [],
    };
  };

  const schemasToStructures = (list: StructureNode[] = []): DSLStructure[] => {
    const structures: DSLStructure[] = [];

    list.forEach(item => {
      const structure = createStructure(item);
      if (item?.children?.length) {
        structure.children = schemasToStructures(item.children);
      }
      schemaMap.set(item.id, item);
      structures.push(structure);
    });

    return structures;
  };

  const structures = schemasToStructures(schemas);

  const pageDSL: PageDSL = {
    id,
    versionNumber: 1,
    md5: '',
    locale: '',
    structures,
    variables: [],
  };

  return { pageDSL, schemaMap };
};

/**
 * transformer foxpage(old) page to fox-open page
 * @param pageDSL foxpage(old) page
 * @param schemaMap fox-open page schema map
 * @returns fox-open page
 */
export const transformToNewDSL = (pageDSL: PageDSL, schemaMap?: SchemaRecord): Page => {
  const { id, structures = [] } = pageDSL;

  const createSchema = (value: DSLStructure): StructureNode => {
    const schema = schemaMap?.get(value.id);
    return {
      id: value.id,
      name: value.type,
      type: 'react.component',
      label: '',
      props: value.props || {},
      directive: schema ? schema.directive : {},
      children: [],
    };
  };

  const structuresToSchemas = (list: DSLStructure[] = []) => {
    const schemas: StructureNode[] = [];

    list.forEach(item => {
      const schema = createSchema(item);
      if (item?.children?.length) {
        schema.children = structuresToSchemas(item.children);
      }
      schemas.push(schema);
    });

    return schemas;
  };

  const schemas = structuresToSchemas(structures);

  const page: Page = {
    id,
    schemas,
    relation: {},
    type: 'page',
  };

  return page;
};

/**
 * transformer & merge fox-open page and dynamic page
 * @param page fox-open page
 * @param dynamicConfig dynamic page config
 * @param opt options
 * @returns fox-open page
 */
export const transformDSL = (
  page: Page,
  dynamicConfig?: PageDSL,
  opt: MergeOption = {
    mergeStrategy: MergeStrategy.replace,
    mountNode: '',
  },
) => {
  if (dynamicConfig) {
    const { pageDSL: staticDSL, schemaMap } = transformToOldDSL(page);

    const merged = doMerge(staticDSL, dynamicConfig, {
      mergeStrategy: opt.mergeStrategy,
      mountNode: opt.mountNode,
    });

    if (!merged) {
      return merged;
    }

    const result = transformToNewDSL(merged, schemaMap);
    result.relation = page.relation;

    return result;
  }

  return page;
};

const doMerge = (staticDSL: PageDSL, dynamicDSL: PageDSL, opt: MergeOption) => {
  try {
    const merged = merge(staticDSL, dynamicDSL, {
      mergeStrategy: opt.mergeStrategy,
      mountNode: opt.mountNode,
    });

    return filterDynamicMountNode(merged, opt.mountNode || '');
  } catch (_e) {
    return null;
  }
};

const filterDynamicMountNode = (mergedDSL: PageDSL, mountType: string) => {
  const { structures = [] } = mergedDSL;
  if (structures.length > 0) {
    const r = (list: DSLStructure[] = []) => {
      let newList: DSLStructure[] = [];
      for (let i = 0; i < list.length; i++) {
        const { children, type } = list[i];

        if (children && children.length > 0) {
          const _children = r(children);

          // filter DYNAMIC_MOUNT_NODE node
          if (type === mountType) {
            newList = newList.concat(_children);
          } else {
            newList.push({
              ...list[i],
              children: _children,
            });
          }
        } else {
          newList.push(list[i]);
        }
      }
      return newList;
    };

    return {
      ...mergedDSL,
      structures: r(structures),
    };
  }
  return mergedDSL;
};
