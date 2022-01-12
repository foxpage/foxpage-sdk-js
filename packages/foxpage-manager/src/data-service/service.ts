import {
  Condition,
  Content,
  ContentInfo,
  ContentRelationInfo,
  FPApplication,
  FPFile,
  FPFunction,
  FPPackage,
  FPPackageResponse,
  ManagerOption,
  PackageNamedVersion,
  Page,
  ResourceUpdateInfo,
  Tag,
  Template,
  Variable,
} from '@foxpage/foxpage-types';

import { createRequest, FoxpageRequest } from './request';

let foxpageDataService: FoxpageDataService;

/**
 * foxpage data service
 *
 * @export
 * @class FoxpageDataService
 */
export class FoxpageDataService {
  /**
   * foxpage webApi request
   *
   * @protected
   * @type {FoxpageRequest}
   */
  protected request: FoxpageRequest;

  constructor(opt: ManagerOption['dataService']) {
    this.request = createRequest(opt);
  }

  /**
   * fetch app details via appIds
   *
   * @param {string[]} appIds
   * @return {*}
   */
  public async fetchAppDetails(appIds: string[]): Promise<FPApplication[]> {
    return ((await this.request('post', '/applications/list', { applicationIds: appIds }, { throwError: true })) ||
      []) as FPApplication[];
  }

  /**
   * fetch changes
   *
   * @param {string} appId
   * @param {number} timestamp
   * @return {*}  {Promise<{
      contents: ResourceUpdateInfo;
      timestamp: number;
    }>}
   */
  public async fetchChanges(
    appId: string,
    timestamp: number,
  ): Promise<{
    contents: ResourceUpdateInfo;
    timestamp: number;
  }> {
    return (await this.request(
      'get',
      '/contents/changes',
      { applicationId: appId, timestamp },
      { throwError: true },
    )) as {
      contents: ResourceUpdateInfo;
      timestamp: number;
    };
  }

  /**
   * fetch application live package
   *
   * @param {string} appId
   * @param {{ packageIds: string[] }} packageIds
   * @return {Promise<FPPackage[]>}
   */
  public async fetchAppPackages(appId: string, { packageIds }: { packageIds?: string[] }): Promise<FPPackage[]> {
    return ((await this.request('post', '/components/live-versions', {
      applicationId: appId,
      componentIds: packageIds,
      type: ['component', 'library'],
    })) || []) as FPPackage[];
  }

  /**
   * fetch packages by name and version
   *
   * @param {string} appId application id
   * @param {{ nameVersions: PackageNamedVersion[] }} { nameVersions }
   * @return {Promise<FPPackageResponse[]>}
   */
  public async fetchAppPackagesByNamedVersions(
    appId: string,
    { nameVersions }: { nameVersions: PackageNamedVersion[] },
  ) {
    return ((await this.request('post', '/components/version-infos', {
      applicationId: appId,
      nameVersions,
      type: ['component', 'library'],
    })) || []) as FPPackageResponse[];
  }

  /**
   * fetch application pages
   *
   * @param {string} appId
   * @param {{ pageIds: string[] }} { page content ids }
   * @return {Promise<Page[]>}
   */
  public async fetchAppPages(appId: string, { pageIds }: { pageIds?: string[] }): Promise<Page[]> {
    return ((await this.request('post', '/pages/lives', { applicationId: appId, ids: pageIds })) || []) as Page[];
  }

  /**
   * fetch application templates
   *
   * @param {string} appId
   * @param {{ templateIds: string[] }} { template content ids }
   * @return {Promise<Template[]>}
   */
  public async fetchAppTemplates(appId: string, { templateIds }: { templateIds?: string[] }): Promise<Template[]> {
    return ((await this.request('post', '/templates/lives', { applicationId: appId, ids: templateIds })) ||
      []) as Template[];
  }

  /**
   * fetch application content via tags
   *
   * @param {string} appId
   * @param {Tag[]} tags tags
   * @return {*}  {(Promise<{
                      content: Content;
                      contentInfo: ContentInfo;
                  }>)}
   */
  public async fetchAppContentByTags(
    appId: string,
    pathname: string,
    tags: Tag[],
  ): Promise<{
    content: Content;
    contentInfo?: ContentInfo;
  }> {
    const result = (await this.request('post', '/content/tag-versions', {
      applicationId: appId,
      pathname,
      tags,
    })) as {
      content: Content;
      contentInfo?: ContentInfo;
    }[];
    return result[0];
  }

  /**
   * fetch content by tag
   *
   * @param {string} appId
   * @param {string} pathname
   * @param {Tag[]} tags
   * @return {*}  {Promise<Content>}
   */
  public async fetchContentByTags(appId: string, pathname: string, tags: Tag[]): Promise<Content> {
    const result = (await this.request('post', '/content/tag-versions', {
      applicationId: appId,
      pathname,
      tags,
    })) as Content[];
    return result[0];
  }

  /**
   * fetch application content
   * contain contentId and tags
   * @param {string} appId
   * @param {string[]} contentIds
   * @return {*}  {Promise<Content[]>}
   */
  public async fetchAppContents(appId: string, { contentIds }: { contentIds: string[] }): Promise<Content[]> {
    return ((await this.request('post', '/contents', { applicationId: appId, contentIds })) || []) as Content[];
  }

  /**
   * fetch application functions
   *
   * @param {string} appId
   * @param {{ functionIds: string[] }} { function content ids }
   * @return {*}  {Promise<FPFunction[]>}
   */
  public async fetchAppFunctions(appId: string, { functionIds }: { functionIds: string[] }): Promise<FPFunction[]> {
    return ((await this.request('post', '/functions/lives', { applicationId: appId, ids: functionIds })) ||
      []) as FPFunction[];
  }

  /**
   * fetch application conditions
   *
   * @param {string} appId
   * @param {{ conditionIds: string[] }} { condition content ids }
   * @return {*}  {Promise<Condition[]>}
   */
  public async fetchAppConditions(appId: string, { conditionIds }: { conditionIds: string[] }): Promise<Condition[]> {
    return ((await this.request('post', '/conditions/lives', { applicationId: appId, ids: conditionIds })) ||
      []) as Condition[];
  }

  /**
   * fetch application variables
   *
   * @param {string} appId
   * @param {{ variableIds: string[] }} { variable content ids }
   * @return {*}  {(Promise<Variable[]>)}
   */
  public async fetchAppVariables(appId: string, { variableIds }: { variableIds: string[] }): Promise<Variable[]> {
    return ((await this.request('post', '/variables/lives', { applicationId: appId, ids: variableIds })) ||
      []) as Variable[];
  }

  /**
   * fetch content & relations info
   *
   * @param {string} appId
   * @param {{ contentIds: string[] }} { contentIds }
   * @return {*}
   */
  public async fetchContentRelationInfos(appId: string, { contentIds }: { contentIds: string[] }) {
    return ((await this.request('post', '/pages/live-infos', { applicationId: appId, ids: contentIds })) ||
      []) as ContentRelationInfo[];
  }

  /**
   * fetch content & relation info in draft status
   *
   * @param {string} appId
   * @param {{ contentIds: string[] }} { contentIds }
   * @return {*}
   */
  public async fetchDraftContentRelationInfos(appId: string, { contentIds }: { contentIds: string[] }) {
    return ((await this.request('post', '/pages/draft-infos', { applicationId: appId, ids: contentIds })) ||
      []) as ContentRelationInfo[];
  }

  /**
   * fetch files
   *
   * @param {string} appId
   * @param {{ fileIds: string[] }} { fileIds }
   * @return {*}
   */
  public async fetchFiles(appId: string, { fileIds }: { fileIds: string[] }) {
    return ((await this.request('post', '/files', { applicationId: appId, ids: fileIds })) || []) as FPFile[];
  }
}

/**
 * create data service
 * @param opt data service options
 */
export const createFoxpageDataService = (opt: ManagerOption['dataService']) => {
  if (!foxpageDataService) {
    foxpageDataService = new FoxpageDataService(opt);
  }
  return foxpageDataService;
};

/**
 * get foxpage dataService instance
 * @returns {FoxpageDataService}
 */
export const getFoxpageDataService = (): FoxpageDataService => {
  return foxpageDataService;
};

export { foxpageDataService };
