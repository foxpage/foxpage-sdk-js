import { ContentDetail, Relation } from '@foxpage/foxpage-types';

import { ContentType } from './types';

/**
 * abstract file content impl
 *
 * @export
 * @class FileContentImpl
 * @implements {ContentDetail<K>}
 * @template T
 */
export class ContentDetailInstance<T = any> implements ContentDetail<T> {
  /**
   * content id
   *
   * @type {string}
   */
  id: string;
  /**
   * content
   *
   * @type {T[]}
   */
  schemas: T[];
  /**
   * relation
   *
   * @type {Relation}
   */
  relation?: Relation;

  relationMap: Map<string, string[]> = new Map<string, string[]>();

  constructor(data: ContentDetail<T>) {
    this.id = data.id;
    this.schemas = data.schemas;
    this.relation = data.relation;

    this.initRelationMap(this.relation, this.relationMap);
  }

  public get templates() {
    return this.relationMap.get(ContentType.TEMPLATE);
  }

  public get variables() {
    return this.relationMap.get(ContentType.VARIABLE);
  }

  public get sysVariables() {
    return this.relationMap.get(ContentType.SYS_VARIABLE);
  }

  public get conditions() {
    return this.relationMap.get(ContentType.CONDITION);
  }

  public get functions() {
    return this.relationMap.get(ContentType.FUNCTION);
  }

  private initRelationMap(relation: Relation = {}, relationMap: Map<string, string[]>) {
    Object.keys(relation).forEach(key => {
      const { id, type } = relation[key];
      // sysVariables,variables,conditions,functions,...
      const keyStr = type === 'sys-variable' ? 'sysVariables' : `${type}s`;
      const value = relationMap.get(keyStr) || ([] as string[]);

      if (keyStr === ContentType.SYS_VARIABLE) {
        const sysVariableKey = key.split(':')[1];
        if (sysVariableKey && value.indexOf(sysVariableKey) === -1) {
          value.push(sysVariableKey);
        }
      } else {
        if (value.indexOf(id) === -1) {
          value.push(id);
        }
      }

      relationMap.set(keyStr, value);
    });
  }
}
