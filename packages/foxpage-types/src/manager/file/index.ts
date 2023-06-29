import { FileTag } from '../tag';
import { ManagerBase } from '..';

export interface FPFile {
  intro: string;
  tags: FileTag[];
  suffix: string;
  id: string;
  name: string;
  applicationId: string;
  type: 'page' | 'template';
  extension?: Record<string, any>;
}

export interface FileManager<T = FPFile> extends ManagerBase<T> {
  addFile(file: FPFile): FPFile | undefined;
  removeFiles(fileIds: string[]): void;
  getFileByPathname(pathname: string): Promise<FPFile | null>;
  getFileById(fileId: string): Promise<FPFile | null>;
  getPathnameByFileId(fileId: string): Promise<string>;
}
