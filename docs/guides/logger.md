# 统一logger

## 使用
```ts
import { createLogger, Logger } from '@foxpage/foxpage-shared';

const logger = createLogger('module mark');

logger.info('');
...
```

## 常用方法
```ts
export interface Logger {
  debug(msg: string, ...params: any[]): void;

  info(msg: string, ...params: any[]): void;

  warn(msg: string, ...params: any[]): void;

  error(msg: string, ...params: any[]): void;

  timeStart(label: string, msg?: string, ...params: any[]): void;

  timeEnd(label: string, msg?: string, ...params: any[]): void;

  log(level: LOGGER_USE_LEVEL, msg: string, params: any[]): void;
}
```

## 说明
logger支持日志等级设置， 本地可开启到debug层级，默认info层级
```ts
if (isDev) {
  process.env.FOXPAGE_DEBUG = '1'; // dev open debug
}
```
