import { Application, Logger, Route, Router } from '@foxpage/foxpage-types';

import { createLogger } from '../common';

/**
 * foxpage router
 * for internal route and dynamic route of customize
 *
 * @export
 * @class RouterInstance
 * @implements {Router}
 */
export class RouterImpl implements Router {
  private routeMap = new Map<string, Route>();
  private logger: Logger;

  constructor(app: Application) {
    this.logger = createLogger(`App@${app.appId} router Manager`);
  }

  /**
   * register the route
   *
   * @param {Route} route
   * @return {*}
   */
  register(routes: Route[]) {
    routes.forEach(route => {
      if (!route.pathname) {
        this.logger?.error('register router failed: pathname is invalid.');
      } else {
        this.routeMap.set(route.pathname, route);
      }
    });
  }

  /**
   * unregister the route
   *
   * @param {Route} route
   */
  unregister(route: Route) {
    if (route.pathname) {
      this.routeMap.delete(route.pathname);
    }
  }

  /**
   * get the route by pathname
   *
   * @param {string} pathname
   * @return {*}
   */
  getRoute(pathname: string) {
    return this.routeMap.get(pathname) || null;
  }

  /**
   * destroy the cache
   */
  destroy() {
    this.routeMap.clear();
  }
}
