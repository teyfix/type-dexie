import { defineMetadata } from '../reflect/define-metadata';
import { getMetadata } from '../reflect/get-metadata';
import { hasMetadata } from '../reflect/has-metadata';
import assert from '../util/assert';
import { MissingPrimaryKeyError } from '../error/missing-primary-key.error';
import { PrimaryKeyAlreadyDefinedError } from '../error/primary-key-already-defined.error';

interface PrimaryMetadata extends Metadata {
  autoIncrement: boolean;
}

export function Primary(autoIncrement = true) {
  return (target: object | Function, propertyKey?: null | Key): void => {
    if ('object' === typeof target) {
      target = target.constructor;
    }

    if (hasMetadata(Primary, target)) {
      throw new PrimaryKeyAlreadyDefinedError();
    }

    defineMetadata(Primary, { propertyKey, autoIncrement }, target as Cls);
  };
}

Primary.getMetadata = (target: Cls): PrimaryMetadata => {
  assert.isEntity(target);

  if (!hasMetadata(Primary, target)) {
    throw new MissingPrimaryKeyError();
  }

  return getMetadata(Primary, target);
};

Primary.has = (target: Cls, propertyKey: Key): boolean => {
  return propertyKey === Primary.getMetadata(target).propertyKey;
};
