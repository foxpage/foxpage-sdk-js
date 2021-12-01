import { pick } from 'lodash';
import moment, { Moment } from 'moment';

export class DateTime {
  static now() {
    return new DateTime();
  }

  static fromString(input: string) {
    return new DateTime(new Date(input));
  }

  private readonly moment: Moment;

  constructor(dateOrInput?: Date | string | number | Moment) {
    this.moment = moment(dateOrInput);
  }

  public get ISOString() {
    return new DateString(this.moment.toISOString(), this);
  }

  public get timestamp() {
    return this.moment.valueOf();
  }

  public get year() {
    return this.moment.year();
  }

  // TODO:
  // 0 ~ 11
  public get month() {
    return this.moment.month();
  }

  // 本月第几日: 1 ~ 31
  public get day() {
    return this.moment.date();
  }

  // TODO:
  // week of month: 1 ~ 5
  public get week() {
    return this.moment.week();
  }

  // day of week, from Sunday: 0 ~ 6
  public get weekDay() {
    return this.moment.day();
  }

  public get hour() {
    return this.moment.hour();
  }

  // 0 ~ 59
  public get minute() {
    return this.moment.minute();
  }

  // 0 ~ 59
  public get second() {
    return this.moment.seconds();
  }

  // -12 ~ 12
  public get zone() {
    return this.moment.utcOffset() / 60;
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

  public valueOf() {
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
