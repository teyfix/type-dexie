type Key = string | symbol;
type Cls<T = object, U extends any[] = unknown[]> = new (...args: U) => T;
type TypeFn<T = object> = () => Cls<T> | [Cls<T>];

interface Metadata {
  propertyKey: Key;
}

interface Definition {
  keyPath: string;
  unique?: boolean;
  multiValued?: boolean;
  autoIncrement?: boolean;
}
