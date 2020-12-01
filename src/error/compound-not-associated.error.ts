import { TypeDexieError } from './type-dexie.error';

export class CompoundNotAssociatedError extends TypeDexieError {
  constructor() {
    super('Compound key path is not associated with a column');
  }
}
