import { TypeDexieError } from './type-dexie.error';

export class MissingKeyPathError extends TypeDexieError {
  constructor() {
    super('Key path must be supplied when property key is a symbol');
  }
}
