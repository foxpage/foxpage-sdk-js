import { random } from 'faker';

import { getURLVar } from '../src/main';

describe('variable provider/URL var', () => {
  it('URL is object', () => {
    const pathname = '/path/sub';
    const hostname = 'localhost';
    const protocol = 'http:';
    const port = 4299;
    const paramValue = random.words();
    const propValue = random.words();
    const searchQuery = `?param=${encodeURIComponent(paramValue)}&prop=${encodeURIComponent(propValue)}`;
    const url = `${protocol}//${hostname}:${port}${pathname}${searchQuery}`;
    const ctx = {
      URL: new URL(url),
    };
    const urlVar = getURLVar(ctx);
    expect(urlVar.protocol).toBe(protocol);
    expect(urlVar.hostname).toBe(hostname);
    expect(urlVar.host).toBe(`${hostname}:${port}`);
    expect(urlVar.pathname).toBe(pathname);
    expect(urlVar.search).toBe(searchQuery);
    expect(urlVar.params.param).toBe(paramValue);
    expect(urlVar.params.prop).toBe(propValue);
  });
});
