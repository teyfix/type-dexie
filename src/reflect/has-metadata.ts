import { Cls, Key } from '../types';

export const hasMetadata = (
  metadataKey: unknown,
  target: object | Cls,
  propertyKey?: Key
): boolean => {
  if (
    null == target ||
    ('object' !== typeof target && 'function' !== typeof target)
  ) {
    return false;
  }

  return Reflect.hasMetadata(metadataKey, target, propertyKey);
};
