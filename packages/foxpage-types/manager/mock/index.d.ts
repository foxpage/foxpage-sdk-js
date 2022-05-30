import { ContentDetail } from '../../content';
import { ManagerBase } from '../../manager';
import { StructureNode } from '../../structure';

export interface MockItem {
  id?: string;
  name?: string;
  props: StructureNode['props'];
}

export interface Mock extends ContentDetail<MockItem> {}

export interface MockManager<T = Mock> extends ManagerBase<T> {
  addMock(mock: Mock): void;
  removeMocks(mockIds: string[]): void;
  getMock(mockId: string): Promise<Mock | undefined>;
  getMocks(mockIds: string[]): Promise<Mock[]>;
  freshMocks(mockIds: string[]): Promise<Mock[]>;
}
