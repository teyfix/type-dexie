import { Cls, Key } from '../types';

export const getMetadata = <T = unknown>(
  metadataKey: unknown,
  target: Cls | Function,
  propertyKey?: Key
): T => {
  return Reflect.getMetadata(metadataKey, target, propertyKey);
};
