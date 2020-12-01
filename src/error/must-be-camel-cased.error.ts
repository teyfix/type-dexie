import { TypeDexieError } from './type-dexie.error';

export class MustBeCamelCasedError extends TypeDexieError {
  constructor() {
    super('Target string must be camel cased');
  }
}
