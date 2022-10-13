export interface ResourceCache<T = any> {
  set(id: string, resource: T, opt?: { cloned?: boolean }): void | Promise<void>;
  get(id: string): T | undefined | null | Promise<T | undefined | null>;
  has(id: string): boolean | Promise<boolean>;
  delete(id: string): void | Promise<void>;
  destroy(): void;
}
