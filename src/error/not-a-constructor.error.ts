import { TypeDexieError } from './type-dexie.error';

export class NotAConstructorError extends TypeDexieError {
  constructor(message?: string) {
    super(message || 'Target is not a constructor');
  }
}
