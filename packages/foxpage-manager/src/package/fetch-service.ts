import https from 'https';

import axios, { AxiosRequestConfig } from 'axios';
import { readFile } from 'fs-extra';

import { Option, optional } from '@foxpage/foxpage-shared';
import { PackageSource } from '@foxpage/foxpage-types';

import { FetchResult } from './fetcher';

const download = async (url: string, opt: Partial<AxiosRequestConfig>) => {
  // At request level
  const agent = new https.Agent({
    rejectUnauthorized: false,
  });
  const config: AxiosRequestConfig = {
    url,
    method: 'GET',
    httpsAgent: agent,
    ...opt,
  };
  return (await axios(config)).data as string;
};

async function fetchFromNet(url: string, opt: Pick<AxiosRequestConfig, 'timeout'>) {
  try {
    const content = await download(url, opt);
    const result: FetchResult = {
      content,
    };
    return optional.ok(result);
  } catch (error) {
    return optional.fail(`download from url: ${url} fail: ${(error as Error).message}`);
  }
}

async function fetchFromFile(filepath: string) {
  try {
    const content = await readFile(filepath, 'utf8');
    const result: FetchResult = {
      content: content,
    };
    return optional.ok(result);
  } catch (error) {
    return optional.fail(`open file "${filepath}" fail: ${(error as Error).message}`);
  }
}

export async function fetchPackage(
  source: PackageSource,
  opt: Pick<AxiosRequestConfig, 'timeout'>,
): Promise<Option<FetchResult>> {
  try {
    if (typeof source === 'string') {
      return fetchFromNet(source, opt);
    }
    switch (source.type) {
      case 'url':
        return fetchFromNet(source.url, opt);
      case 'file':
        return fetchFromFile(source.filepath);
      case 'code':
        return optional.ok({ content: source.code });
    }
  } catch (error) {
    return optional.fail(error);
  }
}
