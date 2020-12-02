import { appendMetadata } from '../reflect/append-metadata';
import { wrapMetadata } from '../reflect/wrap-metadata';
import assert from '../util/assert';
import { Cls, Key, Metadata } from '../types';

export function MultiValued(): PropertyDecorator {
  return (target, propertyKey) =>
    appendMetadata(MultiValued, { propertyKey }, target.constructor);
}

MultiValued.getMetadata = (target: Cls): Metadata[] => {
  assert.isEntity(target);

  return wrapMetadata(MultiValued, [], target);
};

MultiValued.has = (target: Cls, propertyKey: Key): boolean => {
  return MultiValued.getMetadata(target).some((_) => {
    return propertyKey === _.propertyKey;
  });
};
