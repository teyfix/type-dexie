import { defineMetadata } from './define-metadata';
import { getMetadata } from './get-metadata';
import { hasMetadata } from './has-metadata';

export const wrapMetadata = <T>(
  metadataKey: unknown,
  metadataValue: T | (() => T),
  target: Cls | Function,
  propertyKey?: Key
): T => {
  if (!hasMetadata(metadataKey, target, propertyKey)) {
    if ('function' === typeof metadataValue) {
      metadataValue = (metadataValue as Function)();
    }

    defineMetadata(metadataKey, metadataValue, target, propertyKey);
  }

  return getMetadata(metadataKey, target, propertyKey);
};
