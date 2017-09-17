/* tslint:disable:no-unused-variable */
import { Expect, Test, TestFixture, TestCase, SpyOn, Setup, Teardown } from 'alsatian';

import { MockStorage } from '../spec-lib/mock.storage';
import { typedStorageFactory } from './typed-storage-factory';
import { TypedStorageKey } from './typed-storage-key';
import { IConfig } from './i';

@TestFixture("TypedStorageFactory")
export class TypedStorageFactoryTests {
  @Test("runs")
  public runs() {
    Expect(typedStorageFactory()).toBeDefined();
  }

  @Test("should pass prop set through to setItem.")
  public setItemPassesThru(): void {
    let o = {};
    let s = typedStorageFactory({ storage: new MockStorage(o) });
    s["one"] = "two";
    Expect(s.getItem("one")).toBe("two");
  }

  @Test("should pass prop access through to getItem.")
  public getItemPassesThru(): void {
    let o = {};
    let s = typedStorageFactory({ storage: new MockStorage(o) });
    s.setItem("one", "two");
    Expect(s["one"]).toBe(s.getItem("one"));
    Expect(s.getItem("one")).toBe("two");
  }

  @Test('should pass prop access through to typedStorage instance when unrecognized key type (browser internals).')
  public shouldPassPropWhenUnrecogKeyType() {
    let sym = Symbol("foo");
    let o = { sym: "two" };
    let s = typedStorageFactory({ storage: new MockStorage(o) });
    Expect(s[sym]).not.toBeDefined();
  }

  @Test('should pass prop delete through to removeItem.')
  public shouldPassDeleteToRemoveItem() {
    let o = {};
    let s = typedStorageFactory({ storage: new MockStorage(o) }, undefined);
    s.setItem("one", "two");
    Expect(s["one"]).toBe(s.getItem("one"));
    delete s["one"];
    Expect(s.getItem("one")).toBe(null);
  }

  @Test('absense of Proxy class should generate warning.')
  public noProxyClassShouldWarn() {
    let o = {};
    let called = false;
    let l = { warn: function() { called = true; }, log: function() {}, info: function() {}, error: function() {}}
    let s = typedStorageFactory({ storage: new MockStorage(o), logger: l }, undefined, null);
    Expect(called).toBe(true);
  }

  @Test('absense of Proxy class but noProxy on quiets warning.')
  public noProxyClassPreferenceNoWarn() {
    let o = {};
    let called = false;
    let l = { warn: function() { called = true; }, log: function() {}, info: function() {}, error: function() {}}
    let s = typedStorageFactory({ storage: new MockStorage(o), logger: l, noProxy: true }, undefined, null);
    Expect(called).toBe(false);
  }

  @Test('absense of Proxy class still results in usable TypedStorage.')
  public noProxyUsableTypedStorage() {
    let o = {};
    let s = typedStorageFactory({ storage: new MockStorage(o), noProxy: true }, undefined, null);
    s.setItem("one", 1);
    s["two"] = 2;
    Expect(s.getItem<Number>("one")).toBe(1);
    Expect(s["one"]).not.toBeDefined();
    Expect(s.getItem("two")).toBe(null);
  }
}
