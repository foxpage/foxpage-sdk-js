import { Context } from '../../context';

export type RouteActionResult<T extends any = unknown> = T | null | undefined | string;

export interface RouteAction<T extends any = undefined> {
  (context: Context): RouteActionResult<T> | Promise<RouteActionResult<T>>;
}

export interface Route {
  pathname: string;
  action: RouteAction;
}

export interface Router {
  register: (routes: Route[]) => undefined | void;
  unregister: (route: Route) => void;
  getRoute: (pathname: string) => Route | null;
  destroy: () => void;
}

