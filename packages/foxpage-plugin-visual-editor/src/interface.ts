import { Context as KoaContext } from 'koa';

declare module '@foxpage/foxpage-types' {
  export interface Context extends KoaContext {}
}
