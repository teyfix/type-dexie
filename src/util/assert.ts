import { Entity } from '../decorator/entity';
import { NotAnEntityError } from '../error/not-an-entity.error';
import { NotAConstructorError } from '../error/not-a-constructor.error';
import { Cls } from '../types';

class Assert {
  isConstructor(target: Cls | Function, message?: string): void {
    if ('function' !== typeof target || !(target.prototype instanceof Object)) {
      throw new NotAConstructorError(message);
    }
  }

  isEntity(target: Cls, message?: string): void {
    this.isConstructor(target, message);

    if (!Entity.isEntity(target)) {
      throw new NotAnEntityError(message);
    }
  }
}

const assert = new Assert();

export default assert;
