export const contentProxy = (scope: Record<string, unknown>) =>
  new Proxy(scope, {
    get(target, key, receiver) {
      if (typeof key !== 'symbol') {
        if (key in target) {
          return target[key];
        }
        return undefined;
      }
      return Reflect.get(target, key, receiver);
    },
  });
