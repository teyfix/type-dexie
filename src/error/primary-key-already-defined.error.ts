import { TypeDexieError } from './type-dexie.error';

export class PrimaryKeyAlreadyDefinedError extends TypeDexieError {
  constructor() {
    super('Primary key is already defined');
  }
}
