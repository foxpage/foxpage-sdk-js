import { FileTag } from '../tag';
import { ManagerBase } from '../../manager';

export interface FPFile {
  intro: string;
  tags: FileTag[];
  suffix: string;
  id: string;
  name: string;
  applicationId: string;
  type: 'page' | 'template';
}

export interface FileManager<T = FPFile> extends ManagerBase<T> {
  addFile(file: FPFile): FPFile | undefined;
  removeFiles(fileIds: string[]);
  getFileByPathname(pathname: string): Promise<FPFile | null>;
  getFileById(fileId: string): Promise<FPFile | null>;
  getPathnameByFileId(fileId: string): Promise<string>;
}
