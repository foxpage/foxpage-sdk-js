import { pick } from 'lodash';
import moment, { Moment } from 'moment';

export class DateTime {
  private isISO = false;
  static now() {
    return new DateTime();
  }

  static fromString(input: string) {
    return new DateTime(new Date(input));
  }

  private readonly moment: Moment | string;

  constructor(dateOrInput?: Date | string | number | Moment, isISO?: boolean) {
    if (isISO && dateOrInput) {
      this.isISO = isISO;
      this.moment = dateOrInput as string;
    } else {
      this.moment = moment(dateOrInput);
    }
  }

  public get ISOString() {
    if (this.isISO) {
      return this.moment;
    }
    return new DateString((this.moment as Moment).toISOString(), this);
  }

  public get timestamp() {
    if (this.isISO) {
      return new DateTime(this.moment).valueOf() as unknown as string | number;
    }
    return this.moment.valueOf();
  }

  public get year() {
    return (this.moment as Moment).year();
  }

  // TODO:
  // 0 ~ 11
  public get month() {
    return (this.moment as Moment).month();
  }

  // 本月第几日: 1 ~ 31
  public get day() {
    return (this.moment as Moment).date();
  }

  // TODO:
  // week of month: 1 ~ 5
  public get week() {
    return (this.moment as Moment).week();
  }

  // day of week, from Sunday: 0 ~ 6
  public get weekDay() {
    return (this.moment as Moment).day();
  }

  public get hour() {
    return (this.moment as Moment).hour();
  }

  // 0 ~ 59
  public get minute() {
    return (this.moment as Moment).minute();
  }

  // 0 ~ 59
  public get second() {
    return (this.moment as Moment).seconds();
  }

  // -12 ~ 12
  public get zone() {
    return (this.moment as Moment).utcOffset() / 60;
  }

  public toJSON() {
    const keys: Array<keyof this> = [
      'ISOString',
      'timestamp',
      'year',
      'month',
      'day',
      'week',
      'weekDay',
      'hour',
      'minute',
      'second',
      'zone',
    ];
    return pick(this, keys);
  }

  public toString() {
    return this.moment.toString();
  }

  public valueOf(): number | string {
    return this.timestamp;
  }
}

export class DateString {
  public ISOString: string;
  public dateTime: DateTime;
  constructor(ISOString: string, dateTime?: DateTime) {
    this.ISOString = ISOString;
    this.dateTime = dateTime || new DateTime(ISOString);
  }

  public toString() {
    return this.ISOString;
  }

  public valueOf() {
    return this.dateTime.valueOf();
  }

  public toJSON() {
    return this.ISOString;
  }
}
