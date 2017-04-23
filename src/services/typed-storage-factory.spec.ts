/* tslint:disable:no-unused-variable */
import { TestBed, async, inject } from '@angular/core/testing';
import { SimpleMapperModule, IMapperService, MapperService, MapperServiceToken } from 'simple-mapper';

import { MockStorage } from './mock/mock.storage';
import { typedStorageFactory } from './typed-storage-factory';
import { TypedStorageKey } from './typed-storage-key';
import { IConfig } from './i';

describe('TypedStorageFactory', () => {
  beforeEach(() => {
    let config = <IConfig>{
        logger: console,
        viewModels: []
    };
    TestBed.configureTestingModule({
        imports: [
            SimpleMapperModule.forRoot({viewModels: []})
        ],
        providers: [
        ]
    });
  });

  it('should pass prop set through to setItem.', inject([MapperService], (mapper: IMapperService) => {
    let o = {};
    let s = typedStorageFactory({ storage: new MockStorage(o) }, mapper);
    s["one"] = "two";
    expect(s.getItem("one")).toBe("two");
  }));
  it('should pass prop access through to getItem.', inject([MapperService], (mapper: IMapperService) => {
    let o = {};
    let s = typedStorageFactory({ storage: new MockStorage(o) }, mapper);
    s.setItem("one", "two");
    expect(s["one"]).toBe(s.getItem("one"));
    expect(s.getItem("one")).toBe("two");
  }));
  it('should pass prop access through to typedStorage instance when unrecognized key type (browser internals).', inject([MapperService], (mapper: IMapperService) => {
    let sym = Symbol("foo");
    let o = { sym: "two" };
    let s = typedStorageFactory({ storage: new MockStorage(o) }, mapper);
    expect(s[sym]).toBeUndefined();
  }));
  it('should pass prop delete through to removeItem.', inject([MapperService], (mapper: IMapperService) => {
    let o = {};
    let s = typedStorageFactory({ storage: new MockStorage(o) }, mapper);
    s.setItem("one", "two");
    expect(s["one"]).toBe(s.getItem("one"));
    delete s["one"];
    expect(s.getItem("one")).toBe(null);
  }));
  it('absense of Proxy class generates warning.', inject([MapperService], (mapper: IMapperService) => {
    let o = {};
    let called = false;
    let l = { warn: function() { called = true; }, log: function() {}, info: function() {}, error: function() {}}
    let s = typedStorageFactory({ storage: new MockStorage(o), logger: l }, mapper, null);
    expect(called).toBe(true);
  }));
  it('absense of Proxy class but proxy off generates no warning.', inject([MapperService], (mapper: IMapperService) => {
    let o = {};
    let called = false;
    let l = { warn: function() { called = true; }, log: function() {}, info: function() {}, error: function() {}}
    let s = typedStorageFactory({ storage: new MockStorage(o), logger: l, noProxy: true }, mapper, null);
    expect(called).toBe(false);
  }));
  it('absense of Proxy class generates usable typedStorage with no proxying.', inject([MapperService], (mapper: IMapperService) => {
    let o = {};
    let s = typedStorageFactory({ storage: new MockStorage(o), noProxy: true }, mapper, null);
    s.setItem("one", 1);
    s["two"] = 2;
    expect(s.getItem("one")).toBe(1);
    expect(s["one"]).toBeUndefined();
    expect(s.getItem("two")).toBe(null);
  }));
});