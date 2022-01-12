import { DateTime, formatLocale, LocaleStyle } from '@foxpage/foxpage-shared';
import { SystemVariableProvider } from '@foxpage/foxpage-types';

export const sysLocalTime: SystemVariableProvider = {
  name: 'localTime',
  get: () => {
    return DateTime.now();
  },
};

export const sysFormatLocale: SystemVariableProvider = {
  name: 'formatLocale',
  get: () => (locale: string, style: LocaleStyle) => {
    return formatLocale(locale)(style);
  },
};
