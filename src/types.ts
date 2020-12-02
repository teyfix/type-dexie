export type Key = string | symbol;
export type Cls<T = object, U extends any[] = unknown[]> = new (
  ...args: U
) => T;
export type TypeFn<T = object> = () => Cls<T> | [Cls<T>];

export interface Metadata {
  propertyKey: Key;
}

export interface Definition {
  keyPath: string;
  unique?: boolean;
  multiValued?: boolean;
  autoIncrement?: boolean;
}
