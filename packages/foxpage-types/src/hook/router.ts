import { Content } from '../content';
import { Route } from '../manager/router';

export interface FoxpageRouterRegisterHooks {
  registerRouter?: () => Promise<Route>;
  beforeRouteMatch?: () => Promise<Content>;
}
