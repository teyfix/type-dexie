import { appendMetadata } from '../reflect/append-metadata';
import { wrapMetadata } from '../reflect/wrap-metadata';
import assert from '../util/assert';

export function JoinColumn(): PropertyDecorator {
  return (target, propertyKey) =>
    appendMetadata(JoinColumn, { propertyKey }, target.constructor);
}

JoinColumn.getMetadata = (target: Cls): Metadata[] => {
  assert.isEntity(target);

  return wrapMetadata(JoinColumn, [], target);
};

JoinColumn.has = (target: Cls, propertyKey: Key): boolean => {
  return JoinColumn.getMetadata(target).some((_) => {
    return propertyKey === _.propertyKey;
  });
};
