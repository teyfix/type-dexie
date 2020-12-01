import { defineMetadata } from '../reflect/define-metadata';
import { hasMetadata } from '../reflect/has-metadata';

export function Entity(): ClassDecorator {
  return (target) => {
    defineMetadata(Entity, true, target);
  };
}

Entity.isEntity = (target: Cls): boolean => {
  return hasMetadata(Entity, target);
};
