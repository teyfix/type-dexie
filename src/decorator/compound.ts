import { appendMetadata } from '../reflect/append-metadata';
import { wrapMetadata } from '../reflect/wrap-metadata';
import assert from '../util/assert';
import { InsufficientKeyPathError } from '../error/insufficient-key-path.error';

interface CompoundMetadata {
  unique: boolean;
  keyPaths: string[];
}

export function Compound(...keyPaths: Key[]): ClassDecorator;
export function Compound(unique: boolean, ...keyPaths: Key[]): ClassDecorator;
export function Compound(
  unique: boolean | Key,
  ...keyPaths: Key[]
): ClassDecorator {
  if ('string' === typeof unique) {
    return Compound(false, unique, ...keyPaths);
  }

  if (keyPaths.length < 2) {
    throw new InsufficientKeyPathError();
  }

  return (target) => {
    appendMetadata(Compound, { unique, keyPaths }, target);
  };
}

Compound.getMetadata = (target: Cls): CompoundMetadata[] => {
  assert.isEntity(target);

  return wrapMetadata(Compound, [], target);
};

Compound.has = (target: Cls, keyPath: string): boolean => {
  return Compound.getMetadata(target).some((compound) =>
    compound.keyPaths.includes(keyPath)
  );
};
