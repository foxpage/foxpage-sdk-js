export function generateModuleId(name: string, version?: string) {
  return version ? `${name}@${version}` : name;
}

export function validVersion(version?: string) {
  return /^\d+\.\d+\.\d+$/.test(version || '');
}
