import { Column } from '../decorator/column';
import { Compound } from '../decorator/compound';
import { Entity } from '../decorator/entity';
import { JoinColumn } from '../decorator/join-column';
import { MultiValued } from '../decorator/multi-valued';
import { Primary } from '../decorator/primary';
import { Unique } from '../decorator/unique';
import naming from './naming';
import { PrimaryKeyNotAssociatedError } from '../error/primary-key-not-associated.error';
import { CompoundNotAssociatedError } from '../error/compound-not-associated.error';

class EntityCompiler {
  constructor(
    private readonly target: Cls,
    private readonly parent?: Cls,
    private readonly propertyKey?: Key
  ) {}

  static compile(target: Cls, parent?: Cls, propertyKey?: Key): string {
    return new EntityCompiler(target, parent, propertyKey).compile();
  }

  compile(): string {
    return this.primaryKeyDefinition()
      .concat(
        this.columnDefinitions(),
        this.compoundDefinitions(),
        this.childrenDefinition(),
        this.parentDefinition()
      )
      .map(({ keyPath, unique, multiValued, autoIncrement }) => {
        return (
          (autoIncrement ? '++' : '') +
          (unique ? '&' : '') +
          (multiValued ? '*' : '') +
          keyPath
        );
      })
      .join(', ');
  }

  private primaryKeyDefinition(): [Definition] {
    const primary = Primary.getMetadata(this.target);

    if (null == primary.propertyKey) {
      return [
        {
          keyPath: '',
          autoIncrement: primary.autoIncrement,
        },
      ];
    }

    const column = Column.findMetadata(this.target, primary.propertyKey);

    if (null == column) {
      throw new PrimaryKeyNotAssociatedError();
    }

    return [
      {
        keyPath: column.keyPath,
        autoIncrement: primary.autoIncrement,
      },
    ];
  }

  private columnDefinitions(): Definition[] {
    return Column.getMetadata(this.target)
      .filter(({ type, keyPath, propertyKey }) => {
        return !(
          Primary.has(this.target, propertyKey) ||
          Compound.has(this.target, keyPath) ||
          Entity.isEntity(type) ||
          JoinColumn.has(this.target, propertyKey)
        );
      })
      .map(({ keyPath, propertyKey }) => {
        return {
          keyPath,
          unique: Unique.has(this.target, propertyKey),
          multiValued: MultiValued.has(this.target, propertyKey),
        };
      });
  }

  private compoundDefinitions(): Definition[] {
    return Compound.getMetadata(this.target).map((compound) => {
      const column = Column.getMetadata(this.target);
      const keyPaths = compound.keyPaths.map((keyPath) => {
        if (column.some((_) => keyPath === _.keyPath)) {
          return keyPath;
        }

        throw new CompoundNotAssociatedError();
      });

      return {
        unique: compound.unique,
        keyPath: '[' + keyPaths.join('+') + ']',
      };
    });
  }

  private childrenDefinition(): Definition[] {
    return Column.getMetadata(this.target)
      .filter(({ type, propertyKey }) => {
        return (
          Entity.isEntity(type) && JoinColumn.has(this.target, propertyKey)
        );
      })
      .map(({ keyPath, propertyKey }) => {
        return {
          keyPath,
          unique: Unique.has(this.target, propertyKey),
          multiValued: MultiValued.has(this.target, propertyKey),
        };
      });
  }

  private parentDefinition(): Definition | [] {
    if (!this.parent || JoinColumn.has(this.parent, this.propertyKey)) {
      return [];
    }

    return { keyPath: naming.camelCase(this.parent) };
  }
}

export const compileEntity = EntityCompiler.compile;
