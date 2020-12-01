import { TypeDexieError } from './type-dexie.error';

export class NotAnEntityError extends TypeDexieError {
  constructor(message?: string) {
    super(message || 'Target is not an entity');
  }
}
