import { Application, ApplicationOption, FileManager, FPApplication, FPFile } from '@foxpage/foxpage-types';

import { ApplicationImpl } from '@/application';
import { FileManagerImpl } from '@/file/manager';

// import { dataService } from './_mock';

// jest.mock('@/data-service/service');

const pathname = '/demo';

function initFile() {
  const file = {
    id: '1111',
    tags: [{ pathname }],
  } as FPFile;
  return file;
}

describe('file/manager', () => {
  let app: Application;
  let fileManager: FileManager;

  beforeEach(() => {
    const info = {
      id: '1000',
    } as unknown as FPApplication;
    const opt = {} as unknown as ApplicationOption;
    app = new ApplicationImpl(info, opt);
    fileManager = new FileManagerImpl(app);
  });

  afterEach(() => {
    fileManager.destroy();
    app.destroy();
    app = null;
    fileManager = null;
  });

  it('addFile test', () => {
    const file = initFile();
    const result = fileManager.addFile(file);
    expect(result).toBeDefined();
    expect(result.id).toBe(file.id);
  });

  it('removeFiles test', () => {
    const file = initFile();
    fileManager.addFile(file);
    fileManager.removeFiles([file.id]);
  });

  it('removeFiles & getFileByPathname test', async () => {
    const result = await fileManager.getFileByPathname(pathname);
    expect(result).toBeNull();
  });

  it('getPathnameByFileId test', async () => {
    const file = initFile();
    fileManager.addFile(file);
    const result = await fileManager.getPathnameByFileId(file.id);
    expect(result).toBeDefined();
  });

  it('onPull update test', async () => {
    const file = initFile();
    const updates = [file.id];
    // const newName = 'update file';
    // dataService.fetchFiles.mockImplementationOnce(() => {
    //   const newFile = initFile();
    //   newFile.name = newName;
    //   return Promise.resolve([newFile]);
    // });

    await app.refresh({ contents: { file: { updates } } });
    const result = await fileManager.getFileByPathname(file.id);
    expect(result).toBeDefined();
    // expect(result.name).toBe(newName);
  });

  // it('onPull remove test', async () => { });
});
