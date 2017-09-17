/* tslint:disable:no-unused-variable */
import { Expect, Test, TestFixture, TestCase, SpyOn, Setup, Teardown } from 'alsatian';
import { Observable } from 'rxjs';

import { IMapperService, IConfig as IMapperConfig, MapperService, mappable } from 'simple-mapper';
import { MockStorage } from '../spec-lib/mock.storage';
import { TypedStorageConfigToken } from './tokens';
import { TypedStorageService } from './typed-storage.service';
import { TypedStorageKey } from './typed-storage-key';
import { IConfig, ITypedStorageService } from './i';

@TestFixture("TypedStorageService")
export class TypedStorageServiceTests {
    readonly reserved = ["models", "getItem", "setItem", "length", "namespace", "removeItem", "key", "clear", "reserved", "storage", "mapper", "_config", "formattedKey", "primitives", "defaultStorage"];
    tss: ITypedStorageService;
    rawStore: { [key: string]: any };

    @Setup
    public setup() {
        this.rawStore = {};
        let models = {};
        let config = <IConfig>{
            logger: console,
            ns: "com.example.typedstorage",
            models: models,
            storage: new MockStorage(this.rawStore)
        };
        let mapperConfig = <IMapperConfig> {
            models: models,
            validateOnStartup: true,
            noUnmappedWarnings: false
        };
        let simpleMapper = new MapperService(mapperConfig, console);
        this.tss = new TypedStorageService(config, simpleMapper);
    }

    @Test("Should create.")
    public shouldCreate() {
        Expect(this.tss).toBeTruthy();
    }

    @Test("Should create with no defaults object.")
    public shouldHandleNullConstructorArgs() {
        let t = new TypedStorageService();
        Expect(t["_config"]).toEqual({});
        Expect(t["mapper"] instanceof MapperService).toBeTruthy();
    }

    @Test("Should use localStorage by default.")
    public shouldUseLocalStorageDefault() {
        let ts = new TypedStorageService({}, undefined, <any>"test storage");
        Expect(ts["storage"]).toBe(<any>"test storage");
    }

    @Test("Should use configured storage over local.")
    public shouldUseConfiguredStorage() {
        let tss = new TypedStorageService({ storage: <any>"my own" });
        tss["defaultStorage"] = <any>"test storage";
        Expect(tss["storage"]).toBe(<any>"my own");
    }

    @Test("Should throw if no localStorage or configured storage.")
    public shouldThrowOnNoAvailableStorage() {
        try {
            let tss = new TypedStorageService();
            tss["defaultStorage"] = undefined;
            tss["storage"];
            Expect(false).toBe(true);
        } catch(ex) {
            Expect(ex).toBeDefined();
        }
    }

    @Test("Should prevent setting reserved words.")
    public shouldRejectReservedSets() {
        for (var i = 0; i < this.reserved.length; i++) {
            let orig = this.tss.getItem<any>(this.reserved[i]);
            this.tss.setItem(this.reserved[i], "3.14");
            Expect(this.tss.getItem<any>(this.reserved[i])).toBe(orig);
        }
    }

    @Test("Should prevent removing reserved words.")
    public shouldRejectReservedRemoves() {
        for (var i = 0; i < this.reserved.length; i++) {
            let orig = this.tss.getItem<any>(this.reserved[i]);
            this.tss.removeItem(this.reserved[i]);
            Expect(this.tss.getItem<any>(this.reserved[i])).toBe(orig);
        }
    }

    @Test("Should remove strings with string keys.")
    public shouldRemoveWithStringKeys() {
        this.tss.setItem("one", 1.111);
        this.tss.removeItem("one");
        Expect(this.tss.getItem("one")).toBe(null);
    }

    @Test("Should remove strings with typed keys.")
    public shouldRemoveWithTypedKeys() {
        let key = new TypedStorageKey<Number>(Number, "one");
        this.tss.setItem(key, 1.111);
        Expect(this.tss.getItem<number>("one")).toBe(1.111);
        this.tss.removeItem(key);
        Expect(this.tss.getItem("one")).toBe(null);
    }

    @Test("Should prevent clearing reserved words.")
    public shouldRejectReservedClears() {
        for (var i = 0; i < this.reserved.length; i++) {
            let orig = this.tss.getItem<any>(this.reserved[i]);
            this.tss.clear();
            Expect(this.tss.getItem<any>(this.reserved[i])).toBe(orig);
        }
    }

    @Test("Should use namespace.")
    public shouldUseNamespace() {
        this.tss.setItem("one", "1.111");
        let keys = Object.keys(this.rawStore);
        Expect(keys).toContain("com.example.typedstorage.one");
    }

    @Test("Should create sensible typed key name.")
    public shouldCreateSensibleTypedKey() {
        let key = new TypedStorageKey<Number>(Number, "one");
        this.tss.setItem(key, 1.111);
        let keys = Object.keys(this.rawStore);
        Expect(keys).toContain("com.example.typedstorage.one");
    }

    @Test("Should create sensible typed key name w/o namespace.")
    public shouldCreateSensibleTypedKeyWONamespace() {
        let key = new TypedStorageKey<Number>(Number, "one");
        this.tss["_config"].ns = "";
        this.tss.setItem(key, 1.111);
        let keys = Object.keys(this.rawStore);
        Expect(keys).toContain("one");
    }

    @Test("getItem should return null when item not found")
    public getItemNullWhenNotFound() {
        Expect(this.tss.getItem("typoooo")).toBeNull();
    }

    @Test("getItem with model type should use model.")
    public getItemWithModelShouldUseModel() {
        class Model {
            One: string = "one"
        }
        let key = new TypedStorageKey(Model, "one");
        let value = new Model();
        value.One = "two";
        this.tss.setItem(key, value);
        
        let result = this.tss.getItem(key);
        Expect(result).toEqual(value);
    }

    @Test("getItem of item stored with typed key should use configured models.")
    public getItemRetrievedWithStringShouldUseConfiguredModels() {
        class Model {
            One: string = "one"
        }
        this.tss["_config"].models = { Model: Model };
        let key = new TypedStorageKey(Model, "one");
        let value = new Model();
        value.One = "two";
        this.tss.setItem(key, value);
        
        let result = this.tss.getItem("one");
        Expect(result).toEqual(value);
    }

    /*@Test("Should set with string-typed key.")
    public setWithStringTypedTypedKey() {
        let key = new TypedStorageKey<string>("string", "one");
        this.tss.setItem("one", "1.111");
        Expect(this.tss.getItem("one")).toBe("1.111");
    }*/

    @Test("Get/set with string keys.")
    public getSetWithStringKey() {
        this.tss.setItem("one", "1.111");
        Expect(this.tss.getItem("one")).toBe("1.111");
    }

    @TestCase(0, "one")
    @TestCase(1, "two")
    @TestCase(2, "three")
    @TestCase(3, null)
    @Test("Should get the right key.")
    public keyShouldGetKey(n: number, expected: string) {
        this.tss.setItem("one", 1);
        this.tss.setItem("two", 2);
        this.tss.setItem("three", 3);
        Expect(this.tss.key(n)).toBe(expected);
    }

    @TestCase(0, "one")
    @TestCase(1, "two")
    @TestCase(2, "three")
    @TestCase(3, null)
    @Test("Should get the right key with no namespace.")
    public keyShouldGetKeyNoNS(n: number, expected: string) {
        this.tss["_config"].ns = null;
        this.tss.setItem("one", 1);
        this.tss.setItem("two", 2);
        this.tss.setItem("three", 3);
        Expect(this.tss.key(n)).toBe(expected);
    }

    @TestCase(Number, "akey", 1.111, 1.111)
    @TestCase(String, "akey", "1.111", "1.111")
    @TestCase(Date, "akey", new Date("2017-03-14"), new Date("2017-03-14"))
    @TestCase(Boolean, "akey", true, true)
    @Test("Get/set with typed keys.")
    public getSetWithTypedKey(type: new () => any, keyName: string, val: any, expected: any) {
        let key = new TypedStorageKey(type, keyName);
        this.tss.setItem(key, val);
        Expect(this.tss.getItem(key)).toEqual(expected);
    }
}