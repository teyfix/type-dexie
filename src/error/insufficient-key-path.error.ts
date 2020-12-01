import { TypeDexieError } from './type-dexie.error';

export class InsufficientKeyPathError extends TypeDexieError {
  constructor() {
    super('At least 2 key paths must be defined');
  }
}
