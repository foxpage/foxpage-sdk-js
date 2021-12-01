import { EventEmitter } from "events";

export type SafeCallback<T> = T extends (...args: any[]) => void ? T : (...args: any[]) => void;
export type EventEmitterCallback<Events, EventName> = EventName extends keyof Events
  ? SafeCallback<Events[EventName]>
  : (...args: any[]) => void;

export type StringProperties<E> = {
  [P in keyof E]: P extends string ? P : never;
}[keyof E];

export interface TypedEventEmitter<E> extends Omit<EventEmitter, 'on' | 'off' | 'emit' | 'once'> {
  on<Name extends StringProperties<E>>(event: Name, listener: EventEmitterCallback<E, Name>): this;

  emit<Name extends StringProperties<E>>(event: Name, ...args: Parameters<EventEmitterCallback<E, Name>>): boolean;

  off<Name extends StringProperties<E>>(event: Name, listener: EventEmitterCallback<E, Name>): this;

  once<Name extends StringProperties<E>>(event: Name, listener: EventEmitterCallback<E, Name>): this;
}

export interface FPEventEmitter<T> extends TypedEventEmitter<T> { }
