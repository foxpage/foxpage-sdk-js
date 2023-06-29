export interface SSRConfig {
  enable?: boolean;
  mode?: 'string' | 'stream';
  nodeBuildHookTimeout?: number;
  variableParseTimeout?: number;
}
