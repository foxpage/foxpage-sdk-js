import { ManagerBase } from '../../manager'
import { Content, ContentDetail } from '../../content';

export type PathnameTag = Record<'pathname', string>;
export type LocaleTag = {
  locale: string;
  status?: boolean;
}
export type QueryTag = Partial<Record<'query', Record<string, unknown>>>;

export type IsBaseTag = Partial<Record<'isBase', Record<string, unknown>>>;

export type WeightTag = Record<'weight', number>;

export type FileTag = PathnameTag | Record<string, unknown>;

export type Tag = FileTag | LocaleTag | QueryTag | WeightTag | Record<string, unknown>;

export interface ContentTag {
  pageId: string;
  pageTags: Tag[];
}

export interface TagMatchOption {
  pathname?: string;
  fileId?: string;
  withContentInfo?: boolean
}

export interface TagManager<T = Content> extends ManagerBase<T> {
  addTag(content: Content): void;
  removeTags(pageIds: string[] = []): void;
  matchTag(tags: Tag[], opt: TagMatchOption): Promise<Content | null>;
}
