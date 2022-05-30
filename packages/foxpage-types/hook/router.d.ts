import { Route } from '../manager/router';

export interface FoxpageRouterRegisterHooks {
  registerRouter?: () => Promise<Route>;
}
