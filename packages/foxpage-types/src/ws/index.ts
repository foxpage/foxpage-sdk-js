type ContentUpdateInfo = Partial<{
  updates: string[];
  removes: string[];
}>;

export type ResourceUpdateInfo = Partial<
  Record<
    'template' | 'page' | 'variable' | 'condition' | 'function' | 'component' | 'tag' | 'file' | 'mock' | 'block',
    ContentUpdateInfo
  >
>;
