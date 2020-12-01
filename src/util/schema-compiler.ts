import { Column } from '../decorator/column';
import { Entity } from '../decorator/entity';
import assert from './assert';
import { compileEntity } from './entity-compiler';
import naming from './naming';
import { MultipleImplementationsError } from '../error/multiple-implementations.error';

type Schema = Record<string, string>;

class SchemaCompiler {
  private readonly schema: Schema = {};
  private readonly entities: Cls[];

  constructor(entities: Cls[]) {
    this.entities = [...entities];
  }

  static compile(...entities: Cls[]): Schema {
    return new SchemaCompiler(entities).compile();
  }

  compile(): Schema {
    for (const entity of this.entities) {
      this._compile(entity);
    }

    return this.schema;
  }

  private _compile(target: Cls): void;
  private _compile(target: Cls, parent: Cls, propertyKey: Key): void;
  private _compile(target: Cls, parent?: Cls, propertyKey?: Key): void {
    assert.isEntity(target);

    const $name = naming.table(target);
    const $def = compileEntity(target, parent, propertyKey);

    if ($name in this.schema) {
      if ($def !== this.schema[$name]) {
        throw new MultipleImplementationsError($name);
      }
    } else {
      this.schema[$name] = $def;
    }

    Column.getMetadata(target)
      .filter((column) => Entity.isEntity(column.type))
      .forEach((column) => {
        this._compile(column.type, target, column.propertyKey);
      });
  }
}

export const compileSchema = SchemaCompiler.compile;
