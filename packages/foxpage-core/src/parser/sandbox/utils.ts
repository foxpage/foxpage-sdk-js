/**
 * expression formatter
 * @param expression expression
 * @returns
 */
export const EXPFormatter = (expression: string) => {
  return expression.replace(/:/g, '.');
};
