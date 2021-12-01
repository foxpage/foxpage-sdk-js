export function isArray(val: any): val is any[] {
  return Object.prototype.toString.call(val) === '[object Array]';
}
