import { EventEmitter } from 'events';

import PM2 from 'pm2';

import { timeout } from '@foxpage/foxpage-shared';

export interface FPPm2SendData<T extends any> {
  pm2Id: string;
  data: T;
}

let pm2: FPPm2 | null | undefined;

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

  constructor(opt?: { masterPmId: number }) {
    super();
    const instance = process.env.instance_var || 'NODE_APP_INSTANCE';
    this.id = Number(process.env[instance]) || 0;
    this.isPm2 = !!process.env[instance];
    this.isMaster = this.id === opt?.masterPmId;
    this.isWorker = !this.isMaster;
    this.count = Number(process.env.instances) || 1;
    this.mode = this.isPm2 && this.count > 1 ? 'IPC' : 'LOCAL';
  }

  public broadcast(data: any) {
    if (this.mode === 'IPC') {
      if (this.isMaster) {
        PM2.list((error, list) => {
          if (error) {
            console.error('PM2 get list error:', error);
          }
          console.log('master send data to worker');
          list.forEach(proc => {
            if (proc.pm_id) {
              console.log(`worker pm_id: ${proc.pm_id}`);
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
                    console.error(`process:${proc.pm_id} send data failed:`, err);
                  }
                },
              );
            }
          });
        });
      } else {
        console.error('Invalid broadcast by worker.');
        throw new Error('Invalid broadcast by worker.');
      }
    }
  }

  public onMessage(fn?: (data: any) => void) {
    process.on('message', (msg: FPPm2SendData<any>) => {
      const { pId, data } = msg.data || {};

      console.log(`worker@${pId}  received message from master`);
      if (String(pId) === String(process.pid)) {
        if (typeof fn === 'function') {
          fn(data);
        }
      }
    });
  }
}

/**
 * create pm2
 * @param param0
 * @returns pm2 instance
 */
export const createPm2 = async ({ name, enable = true }: { name?: string; enable: boolean }) => {
  if (!enable) {
    pm2 = null;
    return null;
  }
  const list = await getPm2List();
  const filtered = name ? list.filter(item => item.name === name) : list;
  const masterProc = getMasterProc(filtered);
  pm2 = new FPPm2({ masterPmId: Number(masterProc?.pm_id || 0) });
  return pm2;
};

/**
 * get pm2 instance
 * @returns
 */
export const getPm2 = () => {
  return pm2;
};

const getPm2List = async () => {
  const promise = new Promise(resolve => {
    if (typeof PM2.list === 'function') {
      PM2.list((error, list) => {
        if (error) {
          console.error('PM2 get list error:', error);
        }
        resolve(list);
      });
    } else {
      resolve([]);
    }
  });
  try {
    const list: PM2.ProcessDescription[] = await timeout(promise, 1000 * 3);
    return list;
  } catch (e) {
    console.error(e);
    return [];
  }
};

const getMasterProc = (list: PM2.ProcessDescription[]) => {
  return list.sort((one, two) => (one.pm_id || 0) - (two.pm_id || 0))[0];
};
