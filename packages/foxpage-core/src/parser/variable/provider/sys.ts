import { DateTime, formatLocale, LocaleStyle } from '@foxpage/foxpage-shared';
import { Context, SystemVariableProvider } from '@foxpage/foxpage-types';

export const sysLocalTime: SystemVariableProvider = {
  name: 'localTime',
  get: (ctx: Context) => {
    const _foxpage_preview_time = ctx?._foxpage_preview_time;
    if (_foxpage_preview_time) {
      return new DateTime(_foxpage_preview_time, true);
    }
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
