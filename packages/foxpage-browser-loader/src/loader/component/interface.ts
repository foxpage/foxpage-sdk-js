import { FoxpageComponentMeta } from '@foxpage/foxpage-types';

export interface FoxpageComponentStatic {
  meta?: FoxpageComponentMeta;
  version?: string;
}

export interface ComponentInitialPropsOptions<P = Record<string, any>> {
  readonly props: P;
}

export interface FoxpageComponentLifecycle<P = Record<string, string>> {
  getInitialProps?(opt: ComponentInitialPropsOptions<P>): Promise<Partial<P> | void | null | undefined>;
}

export type FoxpageComponentType<P = Record<string, unknown>> =
  | (React.FunctionComponent<P> & FoxpageComponentStatic & FoxpageComponentLifecycle<P>)
  | (React.ComponentClass<P> & FoxpageComponentStatic & FoxpageComponentLifecycle<P>);
