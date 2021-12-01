import { EventEmitter } from 'events';

import PM2 from 'pm2';

import { createLogger, Logger } from '@foxpage/foxpage-shared';

export interface FPPm2SendData<T extends any> {
  pm2Id: string;
  data: T;
}

/**
 * foxpage pm2 instance
 *
 * @export
 * @class FPPm2
 * @extends {EventEmitter}
 */
export class FPPm2 extends EventEmitter {
  public id: number;
  public isMaster: boolean;
  public isWorker: boolean;
  public isPm2: boolean;
  public count: number;
  public mode: 'IPC' | 'LOCAL';

  public logger: Logger;

  constructor() {
    super();
    const instance = process.env.instance_var || 'NODE_APP_INSTANCE';
    this.id = Number(process.env[instance]) || 0;
    this.isPm2 = !!process.env[instance];
    this.isMaster = this.id === 0;
    this.isWorker = !this.isMaster;
    this.count = Number(process.env.instances) || 1;
    this.mode = this.isPm2 && this.count > 1 ? 'IPC' : 'LOCAL';
    this.logger = createLogger('pm2');
  }

  public broadcast(data: any) {
    if (this.mode === 'IPC') {
      if (this.isMaster) {
        PM2.list((error, list) => {
          if (error) {
            console.error('PM2 get list error:', error);
          }

          list.forEach(proc => {
            if (proc.pm_id) {
              PM2.sendDataToProcessId(
                proc.pm_id,
                {
                  id: proc.pm_id,
                  type: 'process:msg',
                  data: {
                    pm2Id: proc.pm_id,
                    pId: proc.pid,
                    data,
                  } as unknown as FPPm2SendData<any>,
                  topic: true,
                },
                err => {
                  if (err) {
                    this.logger.error(`process:${proc.pm_id} send data failed:`, err);
                  }
                },
              );
            }
          });
        });
      } else {
        throw new Error('Invalid broadcast by worker.');
      }
    }
  }

  public onMessage(fn?: (data: any) => void) {
    process.on('message', (msg: FPPm2SendData<any>) => {
      const { pm2Id, data } = msg.data || {};

      if (String(pm2Id) === String(this.id)) {
        if (typeof fn === 'function') {
          this.logger.debug('worker received message from master:', data);
          fn(data);
        }
      }
    });
  }
}

export const pm2 = new FPPm2();
