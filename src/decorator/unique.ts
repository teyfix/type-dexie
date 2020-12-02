import { appendMetadata } from '../reflect/append-metadata';
import { wrapMetadata } from '../reflect/wrap-metadata';
import assert from '../util/assert';
import { Cls, Key, Metadata } from '../types';

export function Unique(): PropertyDecorator {
  return (target, propertyKey) => {
    appendMetadata(Unique, { propertyKey }, target.constructor);
  };
}

Unique.getMetadata = (target: Cls): Metadata[] => {
  assert.isEntity(target);

  return wrapMetadata(Unique, [], target);
};

Unique.has = (target: Cls, propertyKey: Key): boolean => {
  return Unique.getMetadata(target).some((_) => {
    return propertyKey === _.propertyKey;
  });
};
