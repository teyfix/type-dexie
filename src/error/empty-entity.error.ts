import { TypeDexieError } from './type-dexie.error';

export class EmptyEntityError extends TypeDexieError {
  constructor(target: Cls) {
    super(target.name + ' does not have any column definition');
  }
}
