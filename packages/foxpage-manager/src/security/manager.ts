import { Application, Logger, SecurityManager, TicketCheckData } from '@foxpage/foxpage-types';

import { createLogger } from '../common';
import { foxpageDataService } from '../data-service';

/**
 * foxpage router
 * for internal route and dynamic route of customize
 *
 * @export
 * @class RouterInstance
 * @implements {Router}
 */
export class SecurityManagerImpl implements SecurityManager {
  private logger: Logger;

  constructor(app: Application) {
    this.logger = createLogger(`App@${app.appId} security Manager`);
  }

  /**
   * ticket check
   * foxpage created, eg. for authority the sys route
   *
   * @param {string} ticket
   */
  async ticketCheck(ticket: string, data: TicketCheckData) {
    try {
      const { status = false } = (await foxpageDataService.ticketCheck(ticket, data)) || {};
      this.logger?.info(ticket + ' checked:' + status);
      return status;
    } catch (e) {
      this.logger?.warn('check token failed: ' + (e as Error).message);
      return false;
    }
  }
}
