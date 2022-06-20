import { Application, ContentInfo, FileManager, FPFile, ResourceUpdateInfo } from '@foxpage/foxpage-types';

import { ManagerBaseImpl } from '../common';
import { foxpageDataService } from '../data-service';

export class FileManagerImpl extends ManagerBaseImpl<FPFile> implements FileManager {
  /**
   * pathname and file id map
   *
   * @private
   */
  private pathnameMap = new Map<string, string>();

  /**
   * fileId and pathname map
   *
   * @private
   */
  private fileMap = new Map<string, string>();

  constructor(app: Application) {
    super(app, { type: 'file', diskCache: { enable: true } });
  }

  /**
   * add a file
   *
   * @param {FPFile} file file content
   */
  public addFile(file: FPFile) {
    const pathname = this.getPathname(file);
    if (pathname) {
      this.removePathname(pathname, file.id);
      this.addPathname(pathname, file.id);
    }

    this.addOne(file.id, file, file);
    return file;
  }

  /**
   * remove files
   *
   * @param {string[]} fileIds file ids
   */
  public async removeFiles(fileIds: string[]) {
    for (const item of fileIds) {
      const pathname = await this.getPathnameByFileId(item);
      this.removePathname(pathname, item);
    }
    this.remove(fileIds);
  }

  /**
   * get file via pathname
   *
   * @param {string} pathname
   * @return {Promise<FPFile | null>}
   */
  public async getFileByPathname(pathname: string): Promise<FPFile | null> {
    const fileId = this.pathnameMap.get(pathname);
    if (!fileId) {
      return null;
    }
    const file = await this.findOneFromLocal(fileId);
    if (!file) {
      this.removePathname(pathname, fileId);
      return null;
    }
    return file;
  }

  /**
   * get file by fileId
   * @param fileId file id
   * @returns file
   */
  public async getFileById(fileId: string): Promise<FPFile | null> {
    const file = await this.findOneFromLocal(fileId);
    return file || null;
  }

  /**
   * get pathname via file id
   *
   * @param {string} fileId
   * @return {Promise<string>}
   */
  public async getPathnameByFileId(fileId: string): Promise<string> {
    const file = await this.findOneFromLocal(fileId);
    if (!file) {
      return '';
    }
    return this.getPathname(file);
  }

  protected async onPull(data: ResourceUpdateInfo): Promise<void> {
    // updates & removes is file ids
    const { updates, removes } = data.file || {};
    if (updates?.length) {
      const fileIds = await this.filterExists(updates);

      this.markNeedUpdates(fileIds);

      const files = await foxpageDataService.fetchFiles(this.appId, { fileIds });
      files.forEach(file => {
        this.addFile(file);
      });
    }
    if (removes?.length) {
      await this.removeFiles(removes);
    }
  }

  protected onStash(data: ContentInfo) {
    data.files?.map(item => {
      this.addFile(item);
    });
  }

  protected async onFetch(fileIds: string[]): Promise<FPFile[]> {
    const files = await foxpageDataService.fetchFiles(this.appId, { fileIds });
    files.forEach(file => {
      this.addFile(file);
    });
    return files;
  }

  protected async createInstance(data: FPFile) {
    return data;
  }

  private getPathname(file: FPFile) {
    const tags = file.tags;
    const pathnameTag = tags.find(tag => !!tag.pathname);
    return (pathnameTag?.pathname as string) || '';
  }

  private addPathname(pathname: string, fileId: string) {
    this.pathnameMap.set(pathname, fileId);
    this.fileMap.set(fileId, pathname);
  }

  private removePathname(pathname: string, fileId: string) {
    const cachedPathname = this.fileMap.get(fileId);
    if (cachedPathname) {
      this.pathnameMap.delete(cachedPathname);
    }

    const cachedFileId = this.pathnameMap.get(pathname);
    if (cachedFileId) {
      this.fileMap.delete(cachedFileId);
    }
  }

  public destroy() {
    super.destroy();
    this.pathnameMap.clear();
    this.fileMap.clear();
  }
}
