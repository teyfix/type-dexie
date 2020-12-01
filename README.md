# type-dexie

`type-dexie` is a class oriented schema building tool for dexie.js. What that means is that you will not be writing schema strings while you are using dexie.js. Instead, you will be decorating your models and type-dexie will create the stores! Cool right? At least, I thought that it would be cool and here we are :)

## Usage

- First, simply define your models;

```ts
class User {
  id: number;
  username: string;
}
```

- Then, decorate them appropriately;

```ts
class User {
  @Column()
  @Primary()
  id: number;

  @Column()
  username: string;
}
```

- After that, `type-dexie` is ready to create a schema for you;

```ts
const schema = compileSchema(User /* (1) */);

console.log(schema.users); // ++id, username
```

_<sub>1. Other entities if you have any</sub>_

## Pseudo-relations

As you may know, I am calling it pseudo because IndexedDB does not support relations. Even so, type-dexie will parse the columns that you have typed and specify that it is a relation.

### Example!

```ts
@Entity()
class User {
  @Column()
  @Primary()
  id: number;

  @Column()
  username: string;

  @Column(() => [Photo])
  photo: Photo[];
}

@Entity()
class Photo {
  @Column()
  @Primary()
  id: number;

  @Column()
  url: string;

  @Column()
  tags: string[];
}

const schema = compileSchema(User);

console.log(schema.users); // ++id, username
console.log(schema.photos); // ++id, url, tags, user
```

### Storing relation where it is defined

```ts
@Entity()
class User {
  @Column()
  @Primary()
  id: number;

  @Column()
  username: string;

  @Column()
  @JoinColumn()
  profile: Profile;
}

@Entity()
class Profile {
  @Column()
  @Primary()
  id: number;

  @Column()
  biography: string;
}

const schema = compileSchema(User);

console.log(schema.users); // ++id, username, profile
console.log(schema.photos); // ++id, url, tags
```
