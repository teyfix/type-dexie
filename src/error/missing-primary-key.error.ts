import { TypeDexieError } from './type-dexie.error';

export class MissingPrimaryKeyError extends TypeDexieError {
  constructor() {
    super('Target does not have primary key');
  }
}
