import { ContentInfo } from '../content';
import { ResourceUpdateInfo } from '../ws';
export interface AppEvents {
  'DATA_PULL': (data: ResourceUpdateInfo) => void;
  'DATA_STASH': (data: ContentInfo) => void;
}

export interface ManagerEvents {
  'DATA_PUSH': (data: ContentInfo) => void;
}

export interface ScheduleEvents<T> {
  'DATA_RECEIVE': (data: T) => void;
  'ERROR': (data: T) => void;
}
