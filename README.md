[![npm version](https://badge.fury.io/js/typed-storage.svg)](https://badge.fury.io/js/typed-storage)
[![Build Status](https://travis-ci.org/cdibbs/typed-storage.svg?branch=master)](https://travis-ci.org/cdibbs/typed-storage)
[![dependencies Status](https://david-dm.org/cdibbs/typed-storage/status.svg)](https://david-dm.org/cdibbs/typed-storage)
[![devDependencies Status](https://david-dm.org/cdibbs/typed-storage/dev-status.svg)](https://david-dm.org/cdibbs/typed-storage?type=dev)
[![codecov](https://codecov.io/gh/cdibbs/typed-storage/branch/master/graph/badge.svg)](https://codecov.io/gh/cdibbs/typed-storage)

# TypedStorage
A typed wrapper for Storage implementations (localStorage or sessionStorage) that provides an easy way to store and retrieve nested
models from browser storage.

## What it is not
In some browsers, such as Internet Explorer, it cannot be a drop-in replacement for localStorage or sessionStorage when using
property- or dictionary-style references (as opposed to .getItem()/.setItem). The specific
Javascript feature we use for this is the Proxy class. See Mozilla's notes on [browser support for the Proxy class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy#Browser_compatibility)), for more information.

Will work (traditional, non-typed storage):
```typescript
localStorage["mykey"] = 653;
// browser refresh...
let someValue = localStorage["mykey"];
// someValue == "314"
```

Will also work (storage using explicit get/set):
```typescript
typedStorage.setItem("mykey", 653);
// browser refresh...
let someValue = typedStorage.getItem("mykey");
// someValue == "314"
```

Will only work in modern browsers (implicit get/set):
```typescript
typedStorage["mykey"] = 653;
// browser refresh...
let someValue = typedStorage["mykey"];
// someValue == undefined
```

## Features
- It implements the Storage interface, so,

    ```typescript
    let s: Storage = localStorage;
    s = sessionStorage;
    s = typedStorage;
    ```

    all work.

- Provides optional namespacing in the underlying storage provider to avoid key collisions with
  other modules used by your application.
- Permits string keys or instances of TypedStorageKey<T> for better type safety.

## Usage

```typescript
// This presumes TypedStorage was configured with namespace com.example.myapp and localStorage:
let myKey = new TypedStorageKey(MyClass, "myInst");
let myInst: MyClass = new MyClass();
typedStorage.setItem(myKey, myInst);
// localStorage now contains key "com.example.myapp.myInst" with a JSON-serialized representation of myInst.

// ...

myInst = typedStorage.getItem(myKey);
// or
myInst = typedStorage[myKey];
typedStorage.removeItem(myKey);
```

## View Models
We use [SimpleMapper](https://github.com/cdibbs/simple-mapper) to recursively map deserialized objects back
into their original view models. Nested models that you want mapped should use SimpleMapper's @mappable attribute.

```typescript 
export class MyWidget {
    Id: number = 0;
    Name: string = null;
    get Display(): string { 
        return `${Name} (Id: ${Id})`;
    }

    @mappable(MyWidget)
    Wiggy: MyWidget = null;
}
```

*Note:* Each property must have a default value, otherwise SimpleMapper will not be able to detect the property at run-time. The Typescript,
`Id: number;` (with no default value) compiles to return Javascript's `undefined` at run-time. Not even the property key will exist in the
compiled Javascript.

## Installation

`npm install --save-dev typed-storage`

## Setup

```typescript
import { TypedStorageKey, typedStorageFactory, TypedStorageService } from 'typed-storage';
import { MyClass } from './somewhere';

let storage = new TypedStorageService();

// Use the factory, if you want to use the Proxy interface
let storage2 = typedStorageFactory();
let key = new TypedStorageKey(MyClass, "keyName");
storage2.setItem(key, myClassInstance);

let retrieved = storage2["keyName"];
```

## Options
```typescript
let config: IConfig = {
    /** Deprecated. This defaults to console. */
    logger: undefined,

    /** The namespace to use, i.e., com.example.myapp. Default: null = do not use namespace. */
    ns: "com.example.myapp",

    /** The dictionary of models to use for recursive mapping, if any. Default: empty. */
    models: {},

    /**
     * Whether or not to use Proxy to facilitate indexer access to typed storage, i.e., typedStorage[myprop] == typedStorage.getItem(myprop).
     * Proxy does not exist in some older browsers like Internet Explorer. Default: false.
     */
    noProxy: false,

    /** Underlying storage: either localStorage or sessionStorage. Default: localStorage. */
    storage: localStorage,
}
```

The models would all be exported via `index.ts` "barrels".

```typescript
export * from './user-view-model.ts';
export * from './cat-view-model.ts';
// ...
```

And in your classes, import like this:

```typescript
import { TypedStorageService, TypedStorageKey } from 'typed-storage';

export class MyService {
  private userKey: TypedStorageKey<UserViewModel> = new TypedStorageKey(UserViewModel, "user");

  constructor(private typedStorage: TypedStorageService) {
  // ...
  }

  myMethod() {
      doSomething(this.typedStorage.getItem(userKey));
  }
}
```

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `npm test` or `npm run cover` to execute the unit tests or tests + coverage.


## Code coverage

While running tests, code coverage will be available at /[path/to/repo]/coverage/index.html

## Documentation

Run 'npm run compodoc' to generate documentation.
Then run 'npm run compodoc-serve' to see auto-generated documentation and documentation coverage on port 8080.

## Further help

Feel free to post issues.