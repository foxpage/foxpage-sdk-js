/**
 * execute fun
 * @param code string
 * @param args args
 * @param vars {{AA:BB}}
 */
export const executeFun = (code: string, args: any[], vars: any[] = []) => {
  try {
    let expression = code;
    const varStrList: string[] = [];
    const values: any[] = [];
    // for variable define
    vars.forEach(item => {
      expression = expression
        .replaceAll(`'${item.key}'`, item.varStr)
        .replaceAll(`"${item.key}"`, item.varStr)
        .replaceAll('`' + item.key + '`', item.varStr)
        .replaceAll(item.key, item.varStr);

      // for support string with " or '
      if (
        typeof item.value === 'string' &&
        ((item.value as string).includes('"') || (item.value as string).includes("'"))
      ) {
        item.value = `${item.value}`;
      }

      varStrList.push(item.varStr);
      values.push(item.value);
    });
    const wrapper = `return ${expression};`;

    const fun = new Function(...varStrList, wrapper);
    const result = fun(...values).call(...args);
    return result;
  } catch (e) {
    throw new Error('execute function failed: ' + (e as Error).message);
  }
};
