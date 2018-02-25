[![npm version](https://badge.fury.io/js/typed-storage.svg)](https://badge.fury.io/js/typed-storage)
[![Build Status](https://travis-ci.org/ossplz/typed-storage.svg?branch=master)](https://travis-ci.org/ossplz/typed-storage)
[![dependencies Status](https://david-dm.org/ossplz/typed-storage/status.svg)](https://david-dm.org/ossplz/typed-storage)
[![devDependencies Status](https://david-dm.org/ossplz/typed-storage/dev-status.svg)](https://david-dm.org/ossplz/typed-storage?type=dev)
[![codecov](https://codecov.io/gh/ossplz/typed-storage/branch/master/graph/badge.svg)](https://codecov.io/gh/ossplz/typed-storage)
[![Greenkeeper badge](https://badges.greenkeeper.io/ossplz/typed-storage.svg)](https://greenkeeper.io/)

# TypedStorage

A wrapper for Storage implementations (local or session) that provides an easy way to store and retrieve strongly-typed, nested models.

## Basic Usage

``` typescript
let myKey = new TypedStorageKey(MyClass, "myKey"); // typed
let myClassInstance: MyClass = someFactory();
typedStorage.setItem(myKey, myClassInstance);

// ... browser refresh ...

let myRetrievedInstance = typedStorage.getItem(myKey);
```

## Features

- Optionally namespaced storage keys
  - When so configured, `ts.getItem(aKey)` can translate to `storage.getItem("com.example.myPrimKey");`
- Implements the Storage interface, so the API is a superset of browser storage
- Deserializes nested models via a configurable mapper
  - We use SimpleMapper for mapping, but you are free to [provide your own mapper](#custom-model-mapper) implementation during initialization.
- Understands native types: `ts.setItem("loggedIn", new Date())` followed by `ts.getItem("loggedIn")` will retrieve a Date object.

## What it is not (anti-features)

While getItem and setItem are available in all browsers, dictionary-style references, like `typedStorage['key']`,
are unavailable in some older browsers such as Internet Explorer (but not Edge), for example. In such browsers,
typedStorage cannot be a drop-in replacement for localStorage or sessionStorage, which
allow such references.

The specific browser feature we use is the Proxy class.
See Mozilla's notes on [browser support for the Proxy class][1], for more information.

### What works in all browsers

```typescript
typedStorage.setItem("keyOne", 653); // untyped

let myKey = new TypedStorageKey(MyClass, "myInst"); // typed
let myClassInstance: MyClass = new MyClass();
typedStorage.setItem(myKey, myClassInstance);

// ... browser refresh ...

let someValue = typedStorage.getItem("keyOne"); // untyped
let noTwo = typedStorage.getItem(new TypedStorageKey(MyClass, "myInst"));
// someValue == "653"
// noTwo == myClassInstance
typedStorage.clear();
typedStorage.removeItem(myKey); // redundant after clear()
```

### What works in [browsers that implement the Proxy class][1]

```typescript
typedStorage["mykey"] = 653;

// browser refresh...

let someValue = typedStorage["mykey"];
// someValue == undefined
```

## Model Mapping

We use [SimpleMapper](https://github.com/cdibbs/simple-mapper) to recursively map deserialized objects back
into their original models. Nested models should use SimpleMapper's @mappable attribute, if you want them to be
recursively mapped.

You can also implement the `map()` method on the `IMapper` interface ([below](#custom-model-mapper)) to supply your own Or, you can wrap a 3rd-party mapper library.

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

Each destination property must have a default value, otherwise SimpleMapper will not be able to detect the property at run-time. The Typescript,
`Id: number;` (with no default value) compiles to return Javascript's `undefined` at run-time. In that case, not even the property key would exist in the compiled Javascript.

### Custom Model Mapper

If you are going to implement a custom model mapper, you only need to implement IMapper and supply that during configuration.

```typescript
export interface IMapper {
    /** Recursively maps an object into a model.
     * @param {instantiable} t The constructable destination model.
     * @param {any} object The source object.
     * @return {T} The constructed model with all of its properties mapped.
     * @example map(UserViewModel, { "name": "batman" });
     */
    map<T>(t: { new (): T }, object: any): T;
}
```

## Installation

`npm install --save-dev typed-storage`

## Setup and Options

```typescript
import { TypedStorageKey, typedStorageFactory, TypedStorageService } from 'typed-storage';
import { MyClass } from './somewhere';

let config: IConfig = {
    /** Defaults to console. */
    logger: undefined,

    /** The namespace to use, i.e., com.example.myapp. Default: null = do not use namespace. */
    ns: "com.example.myapp",

    /**
     * Whether or not to use Proxy to facilitate indexer access to typed storage, i.e., typedStorage[myprop] == typedStorage.getItem(myprop).
     * Proxy does not exist in some older browsers like Internet Explorer. Default: false.
     */
    noProxy: false,

    /** Underlying Storage implementation used by typedStorage. Typically, either localStorage or sessionStorage. Default: localStorage. */
    storage: localStorage,
}

// Use the factory, if you want to use the Proxy interface.
let storage = typedStorageFactory(config);
```

And in your classes, use it like this:

```typescript
import { injectable, inject } from 'inversify';
import { TypedStorageService, TypedStorageKey } from 'typed-storage';
import TYPES from '../di/types';

@injectable()
export class MyService {
  private userKey: TypedStorageKey<UserViewModel> = new TypedStorageKey(UserViewModel, "user");

  constructor(@inject(TYPES.Storage) private typedStorage: TypedStorageService) {
  // ...
  }

  myMethod() {
      doSomething(this.typedStorage.getItem(userKey));
  }
}
```

## Building from source and contributing

Contributions are welcome. Please follow good code quality conventions.

### Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory.

### Running unit tests

Run `npm test` or `npm run cover` to execute the unit tests or tests + coverage.

### Code coverage

While running tests, code coverage will be available at /[path/to/repo]/coverage/index.html

### Documentation

Run 'npm run compodoc' to generate documentation.
Then run 'npm run compodoc-serve' to see auto-generated documentation and documentation coverage on port 8080.

## Further help

Feel free to post issues.

[1]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy#Browser_compatibility
