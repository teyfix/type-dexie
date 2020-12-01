import { appendMetadata } from '../reflect/append-metadata';
import { getMetadata } from '../reflect/get-metadata';
import assert from '../util/assert';
import { MissingKeyPathError } from '../error/missing-key-path.error';
import { hasMetadata } from '../reflect/has-metadata';
import { EmptyEntityError } from '../error/empty-entity.error';

export interface ColumnMetadata extends Metadata {
  keyPath: string;
  typeFn: TypeFn;
  type: Cls;
  isArray: boolean;
}

export function Column(typeFn?: TypeFn): PropertyDecorator;
export function Column(keyPath?: string, typeFn?: TypeFn): PropertyDecorator;
export function Column(
  keyPath?: string | TypeFn,
  typeFn?: TypeFn
): PropertyDecorator {
  if ('function' === typeof keyPath) {
    return Column(null, keyPath);
  }

  return (target, propertyKey) => {
    if (null == keyPath) {
      if ('symbol' === typeof propertyKey) {
        throw new MissingKeyPathError();
      }

      keyPath = propertyKey;
    }

    if (null == typeFn) {
      typeFn = () => Reflect.getMetadata('design:type', target, propertyKey);
    }

    appendMetadata(
      Column,
      { keyPath, typeFn, propertyKey },
      target.constructor
    );
  };
}

Column.getMetadata = (target: Cls): ColumnMetadata[] => {
  assert.isEntity(target);

  if (!hasMetadata(Column, target)) {
    throw new EmptyEntityError(target);
  }

  return getMetadata<ColumnMetadata[]>(Column, target).map((metadata) => {
    const $type = metadata.typeFn();

    if ($type instanceof Array) {
      metadata.type = $type[0];
      metadata.isArray = true;
    } else {
      metadata.type = $type;
      metadata.isArray = $type === Array;
    }

    return metadata;
  });
};

Column.findMetadata = (target: Cls, propertyKey: Key): ColumnMetadata => {
  return Column.getMetadata(target).find((_) => {
    return propertyKey === _.propertyKey;
  });
};
