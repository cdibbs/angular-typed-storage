[![npm version](https://badge.fury.io/js/angular-typed-storage.svg)](https://badge.fury.io/js/angular-typed-storage)
[![Build Status](https://travis-ci.org/cdibbs/angular-typed-storage.svg?branch=master)](https://travis-ci.org/cdibbs/angular-typed-storage)
[![dependencies Status](https://david-dm.org/cdibbs/angular-typed-storage/status.svg)](https://david-dm.org/cdibbs/angular-typed-storage)
[![devDependencies Status](https://david-dm.org/cdibbs/angular-typed-storage/dev-status.svg)](https://david-dm.org/cdibbs/angular-typed-storage?type=dev)
[![codecov](https://codecov.io/gh/cdibbs/angular-typed-storage/branch/master/graph/badge.svg)](https://codecov.io/gh/cdibbs/angular-typed-storage)

# TypedStorage
The Angular 2 & 4 TypedStorage module provides an easy way to store and retrieve recursively-defined
view models from browser storage (either localStorage or sessionStorage).

## What it is not
Functionally, it is not a total substitute for localStorage or sessionStorage when using dictionary-style references.

Will work:
```typescript
localStorage["mykey"] = 653;
// browser refresh...
let someValue = localStorage["mykey"];
// someValue == "314"
```

Will also work:
```typescript
typedStorage.setItem("mykey", 653);
// browser refresh...
let someValue = typedStorage.getItem("mykey");
// someValue == "314"
```

Will NOT work:
```typescript
typedStorage["mykey"] = 653;
// browser refresh...
let someValue = typedStorage["mykey"];
// someValue == undefined
```

## Features
- It implements the Storage interface:
```typescript
let s: Storage = localStorage;
s = sessionStorage;
s = typedStorage;
```
- Allows optional namespacing in the underlying storage provider to avoid key collisions with
  other modules used by your application.
- Can use either string keys or instances of TypedStorageKey<T> for better type safety.

## Usage

```typescript
// This presumes TypedStorage was configured with namespace com.example.myapp and localStorage:
let myKey = new TypedStorageKey(MyClass, "myInst");
let myInst: MyClass = new MyClass();
typedStorage.setItem(myKey, myInst);
typedStorage[myKey] = myInst; // WILL NOT work, at present. Could work with future versions of Javascript.
// localStorage now contains key "com.example.myapp.myInst" with a JSON-serialized representation of myInst.

// ...

myInst = typedStorage.getItem(myKey);
// or
myInst = typedStorage[myKey];
typedStorage.removeItem(myKey);
```

## View Models
Uses [SimpleMapper](https://github.com/cdibbs/angular-typed-storage) to handle recursively mapping deserialized objects back into their original view models. Nested models that you want mapped should use SimpleMapper's
@mappable attribute.

```typescript 
export class MyWidget {
    Id: number = 0;
    Name: string = null;
    get Display(): string { 
        return `${Name} (Id: ${Id})`;
    }

    @mappable("MyWidget")
    Wiggy: MyWidget = null;
}
```

## Installation

Run `npm install --save-dev typed-storage` inside of an Angular 4 project.

## Setup
Inside your application's app.module.ts file, make the following additions.

```typescript
// ...
import { TypedStorage } from 'typed-storage';

// ...
import * as vm from './view-models';

@NgModule({
    declarations: [
        // ...
    ],
    imports: [
        // ...
        TypedStorage.forRoot({viewModels: vm, ns: "com.example.app", logger: console})
    ]
})
export class AppModule {
    constructor() {
```

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help

To get more help on the `angular-cli` use `ng help` or go check out the [Angular-CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
