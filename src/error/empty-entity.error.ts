import { TypeDexieError } from './type-dexie.error';
import { Cls } from '../types';

export class EmptyEntityError extends TypeDexieError {
  constructor(target: Cls) {
    super(target.name + ' does not have any column definition');
  }
}
