/* tslint:disable:no-unused-variable */
import { Expect, Test, TestFixture, TestCase, SpyOn, Setup, Teardown } from 'alsatian';

import { MockStorage } from '../spec-lib/mock.storage';
import { typedStorageFactory } from './typed-storage-factory';
import { TypedStorageKey } from './typed-storage-key';
import { IConfig } from './i';

@TestFixture("TypedStorageKey")
export class TypedStorageKeyTests {

    @Test("get key gets")
    public get_key_gets() {
        var k = new TypedStorageKey(String, "something");
        Expect(k.key).toBe("something");
    }

    @Test("get type gets")
    public get_type_gets() {
        var k = new TypedStorageKey(String, "something");
        Expect(k.type).toBe(String);
    }

    @Test("get typeName gets")
    public get_typeName_gets() {
        var k = new TypedStorageKey(Object, "something");
        Expect(k.typeName).toBe("Object");
    }

    @Test("toString stringifies")
    public toString_stringifies() {
        var k = new TypedStorageKey(String, "something");
        Expect(k.toString()).toBe("something");
    }
}