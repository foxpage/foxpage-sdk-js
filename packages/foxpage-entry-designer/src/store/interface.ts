export type StoreValueType = Record<string, any>;

export type StoreConsumer<V extends any = any> = (newValue: V) => void;

export interface StoreType<State extends StoreValueType = StoreValueType> {
  state: State;
  consumers: Partial<Record<keyof State, StoreConsumer[]>>;
  getState<K extends keyof State>(namespace: K, initValue?: State[K]): State[K] | undefined;

  dispatch<K extends keyof State>(targetNamespace: K, updated: State[K]): void;
  subscribe<K extends keyof State>(namespace: K, consumer: StoreConsumer<State[K]>): void;
  unsubscribe<K extends keyof State>(namespace: K, consumer: StoreConsumer<State[K]>): void;
}
