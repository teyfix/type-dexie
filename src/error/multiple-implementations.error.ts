import { TypeDexieError } from './type-dexie.error';

export class MultipleImplementationsError extends TypeDexieError {
  constructor(targetName: string) {
    super('Multiple implementations on ' + targetName);
  }
}
