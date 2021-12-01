import { ServerStyleSheet } from 'styled-components';

declare module '@foxpage/foxpage-types' {
  interface StyledComponentsContext {
    sheet?: ServerStyleSheet;
  }
  export interface Context extends StyledComponentsContext {}
}
