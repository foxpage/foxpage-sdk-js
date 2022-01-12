import { createLogger, LOGGER_LEVEL } from '@/logger';

describe('logger/logger', () => {
  it('logger by level', () => {
    const logger = createLogger('', { level: LOGGER_LEVEL.WARN });
    const fn = jest.spyOn(logger, 'formatMessage');
    logger.debug('');
    logger.info('');
    expect(fn.mock.calls.length).toBe(0);
    logger.warn('');
    logger.error('');
    expect(fn.mock.calls.length).toBe(2);
  });

  it('timeStart & timeEnd test', () => {
    const logger = createLogger('', { level: LOGGER_LEVEL.WARN });
    logger.timeStart('time');
    const result = logger.timeEnd('time');
    expect(result).toBeDefined();
  });
});
