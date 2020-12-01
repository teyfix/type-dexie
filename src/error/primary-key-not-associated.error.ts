import { TypeDexieError } from './type-dexie.error';

export class PrimaryKeyNotAssociatedError extends TypeDexieError {
  constructor() {
    super('Primary key is not associated with a column');
  }
}
