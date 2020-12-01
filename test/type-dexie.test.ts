import 'fake-indexeddb/auto';
import 'reflect-metadata';
import { CompoundNotAssociatedError } from '../src/error/compound-not-associated.error';
import { EmptyEntityError } from '../src/error/empty-entity.error';
import { InsufficientKeyPathError } from '../src/error/insufficient-key-path.error';
import { MissingKeyPathError } from '../src/error/missing-key-path.error';
import { MissingPrimaryKeyError } from '../src/error/missing-primary-key.error';
import { MultipleImplementationsError } from '../src/error/multiple-implementations.error';
import { MustBeCamelCasedError } from '../src/error/must-be-camel-cased.error';
import { NotAConstructorError } from '../src/error/not-a-constructor.error';
import { PrimaryKeyAlreadyDefinedError } from '../src/error/primary-key-already-defined.error';
import { PrimaryKeyNotAssociatedError } from '../src/error/primary-key-not-associated.error';
import {
  Column,
  compileSchema,
  Compound,
  Entity,
  JoinColumn,
  NotAnEntityError,
  Primary,
  Unique,
} from '../src/type-dexie';

describe('compileSchema', () => {
  it('should throw compound not associated', function () {
    @Entity()
    @Primary()
    @Compound('age', 'name')
    class User {
      @Column()
      name: string;
    }

    expect(() => compileSchema(User)).toThrow(new CompoundNotAssociatedError());
  });

  it('should throw empty entity', () => {
    @Entity()
    @Primary()
    class User {
      username: string;
    }

    expect(() => compileSchema(User)).toThrow(new EmptyEntityError(User));
  });

  it('should throw insufficient key path', function () {
    expect(() => {
      @Compound('username')
      class User {}
    }).toThrow(new InsufficientKeyPathError());
  });

  it('should throw missing key path', function () {
    const username = Symbol();

    expect(() => {
      class User {
        @Column()
        [username]: string;
      }
    }).toThrow(new MissingKeyPathError());
  });

  it('should throw missing primary key', () => {
    @Entity()
    class User {
      @Column()
      username: string;
    }

    expect(() => compileSchema(User)).toThrow(new MissingPrimaryKeyError());
  });

  it('should throw multiple implementations', function () {
    @Entity()
    @Primary()
    class User {
      @Column(() => Profile)
      profile: Profile;
    }

    @Entity()
    @Primary()
    class UserTwo {
      @Column(() => Profile)
      profile: Profile;
    }

    @Entity()
    @Primary()
    class Profile {
      @Column()
      biography: string;
    }

    expect(() => compileSchema(User, UserTwo)).toThrow(
      new MultipleImplementationsError('profiles')
    );
  });

  it('should throw must be camel cased', function () {
    @Entity()
    @Primary()
    class $ {
      @Column()
      username: string;
    }

    expect(() => compileSchema($)).toThrow(new MustBeCamelCasedError());
  });

  it('should throw not a constructor', function () {
    expect(() => Column.getMetadata(null)).toThrow(new NotAConstructorError());
  });

  it('should throw not an entity', () => {
    class User {
      @Column()
      username: string;
    }

    expect(() => compileSchema(User)).toThrow(new NotAnEntityError());
  });

  it('should throw primary key already defined', function () {
    expect(() => {
      class User {
        @Primary()
        id: number;

        @Primary()
        username: string;
      }
    }).toThrow(new PrimaryKeyAlreadyDefinedError());
  });

  it('should throw not associated', function () {
    @Entity()
    class User {
      @Primary()
      id: number;

      @Column()
      username: string;
    }

    expect(() => compileSchema(User)).toThrow(
      new PrimaryKeyNotAssociatedError()
    );
  });

  it('should create users table definition', () => {
    @Entity()
    class User {
      @Column()
      @Primary()
      id: number;

      @Column()
      @Unique()
      username: string;

      @Column(() => Photo)
      photo: Photo;

      @Column(() => Profile)
      @JoinColumn()
      profile: Profile;
    }

    @Entity()
    class Photo {
      @Primary()
      @Column()
      id: number;

      @Column()
      url: string;

      @Column()
      tags: string[];
    }

    @Entity()
    class Profile {
      @Column()
      @Primary()
      id: number;

      @Column()
      biography: string;
    }

    const schema = compileSchema(User) as Record<
      'users' | 'photos' | 'profiles',
      string
    >;

    expect(schema.users).toBe('++id, &username, profile');
    expect(schema.photos).toBe('++id, url, tags, user');
    expect(schema.profiles).toBe('++id, biography');
  });
});
