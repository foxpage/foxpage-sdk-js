export const generateKey = (name: string, version?: string) => {
  return `${name}_${version || ''}`;
};

export const splitKey = (key: string) => {
  return key.split('_');
};
