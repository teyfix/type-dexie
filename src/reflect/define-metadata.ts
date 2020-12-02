import { Cls, Key } from '../types';

export const defineMetadata = (
  metadataKey: unknown,
  metadataValue: unknown,
  target: Cls | Function,
  propertyKey?: Key
): void => {
  return Reflect.defineMetadata(
    metadataKey,
    metadataValue,
    target,
    propertyKey
  );
};
