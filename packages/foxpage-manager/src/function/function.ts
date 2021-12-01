import { FPFunction, FPFunctionItem } from '@foxpage/foxpage-types';

import { ContentDetailInstance } from '../common';

/**
 * function
 *
 * @export
 * @interface FPFunction
 * @extends {ContentDetailInstance<FPFunctionItem>}
 */
export class FPFunctionInstance extends ContentDetailInstance<FPFunctionItem> implements FPFunction {
  /**
   * function item map
   *
   * @type {Map<string, FPFunctionItem>}
   */
  protected functionItemMap: Map<string, FPFunctionItem> = new Map<string, FPFunctionItem>();

  constructor(data: FPFunction) {
    super(data);
    // list to map
    this.schemas.forEach(item => {
      this.functionItemMap.set(item.name, item);
    });
  }

  /**
   * get function item content
   *
   * @param {string} functionName
   * @return {*}  {(FPFunctionItem | undefined)}
   */
  public getFunctionItem(functionName: string): FPFunctionItem | null {
    return this.functionItemMap.get(functionName) || null;
  }

  /**
   * destroy, clear map data
   */
  public destroy() {
    this.functionItemMap.clear();
  }
}
