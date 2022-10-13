import { DateTime, formatLocale, LocaleStyle } from '@foxpage/foxpage-shared';
import { Context, SystemVariableProvider } from '@foxpage/foxpage-types';

export const sysLocalTime: SystemVariableProvider = {
  name: 'localTime',
  get: () => {
    return DateTime.now();
  },
};

export const locale: SystemVariableProvider = {
  name: 'locale',
  get: (ctx: Context) => {
    return ctx.locale || 'en-US';
  },
};

export const sysFormatLocale: SystemVariableProvider = {
  name: 'formatLocale',
  get: () => (locale: string, style: LocaleStyle) => {
    return formatLocale(locale)(style);
  },
};
