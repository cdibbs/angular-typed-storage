[![npm version](https://badge.fury.io/js/typed-storage.svg)](https://badge.fury.io/js/typed-storage)
[![Build Status](https://travis-ci.org/cdibbs/typed-storage.svg?branch=master)](https://travis-ci.org/cdibbs/typed-storage)
[![dependencies Status](https://david-dm.org/cdibbs/typed-storage/status.svg)](https://david-dm.org/cdibbs/typed-storage)
[![devDependencies Status](https://david-dm.org/cdibbs/typed-storage/dev-status.svg)](https://david-dm.org/cdibbs/typed-storage?type=dev)
[![codecov](https://codecov.io/gh/cdibbs/typed-storage/branch/master/graph/badge.svg)](https://codecov.io/gh/cdibbs/typed-storage)

# TypedStorage

A typed wrapper for Storage implementations (localStorage or sessionStorage) that provides an easy way to store and retrieve nested
models from browser storage.

  * [Features](#features)
  * [What it is not (anti-features)](#what-it-is-not--anti-features-)
    + [What works in all browsers](#what-works-in-all-browsers)
    + [What works only in browsers that implement the Proxy class](#what-works-only-in-browsers-that-implement-the-proxy-class)
  * [Model Mapping](#model-mapping)
    + [Custom Model Mapper](#custom-model-mapper)
  * [Installation](#installation)
  * [Setup and Options](#setup-and-options)
  * [Building from source and contributing](#building-from-source-and-contributing)
    + [Build](#build)
    + [Running unit tests](#running-unit-tests)
    + [Code coverage](#code-coverage)
    + [Documentation](#documentation)
  * [Further help](#further-help)

## Features

- Optionally namespaced storage keys
  - When so configured, `ts.getItem("myKey")` can translate to `storage.getItem("com.example.myKey");`
- Implements the Storage interface, so the API is a superset of browser storage
- Deserializes nested models via a configurable mapper
  - We use SimpleMapper for mapping, but you are free to [provide your own mapper](#custom-model-mapper) implementation during initialization.
- Understands native types: `ts.setItem("now", new Date())` followed by `ts.getItem("now")` will retrieve a Date object.

## What it is not (anti-features)

While getItem and setItem are available in all browsers, dictionary-style references
are unavailable in Internet Explorer (but not Edge), for example. In such browsers,
typedStorage be a drop-in replacement for localStorage or sessionStorage. The specific
browser feature needed is the Proxy class. See Mozilla's notes on
[browser support for the Proxy class][1], for more information.

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

### What works only in browsers that implement the Proxy class

```typescript
typedStorage["mykey"] = 653;

// browser refresh...

let someValue = typedStorage["mykey"];
// someValue == undefined
```

## Model Mapping

We use [SimpleMapper](https://github.com/cdibbs/simple-mapper) to recursively map deserialized objects back
into their original models. Nested models that you want mapped should use SimpleMapper's @mappable attribute.

You can also implement IMapper.map and supply your own (or wrap a 3rd-party mapper library).

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

### Custom Model Mapper

To implement a custom model mapper, you only need to implement IMapper and supply that during configuration.

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

## Building from source and contributing

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

[1]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy#Browser_compatibility)