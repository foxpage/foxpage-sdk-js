import { ConditionUsed } from '../../interface';

export function concatUsedConditionsById(oldList: Array<ConditionUsed> = [], newList: Array<ConditionUsed> = []) {
  const result = newList.slice();
  oldList.forEach(item => {
    const idx = result.findIndex(it => it.id === item.id);
    if (idx === -1) {
      result.push(item);
    }
  });
  return result;
}
