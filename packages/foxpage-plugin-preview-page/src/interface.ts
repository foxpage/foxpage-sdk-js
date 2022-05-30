import { Context as KoaContext } from 'koa';

declare module 'http' {
  export interface IncomingMessage {}
}

declare module '@foxpage/foxpage-types' {
  export interface Context extends KoaContext {}
}
