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

    @Test("Should use localStorage by default or throw.")
    public shouldUseLocalStorageDefaultOrThrow() {
        if (typeof localStorage !== "undefined") {
            Expect(new TypedStorageService()["storage"]).toBe(localStorage);
        } else {
            try {
                new TypedStorageService()["storage"];
                Expect(false).toBe(true);
            } catch(ex) {
                Expect(ex).toBeDefined();
            }
        }
    }

    @Test("Should use empty models by default.")
    public shouldUseEmptyModelsDefault() {
        Expect(new TypedStorageService()["models"]).toEqual({});
    }

    @Test("Should prevent setting reserved words.")
    public shouldRejectReservedSets() {
        let reserved = ["models", "getItem", "setItem", "length", "namespace", "removeItem", "key", "clear", "reserved", "storage", "mapper", "_config", "formattedKey"];
        for (var i = 0; i < reserved.length; i++) {
            let orig = this.tss.getItem(reserved[i]);
            this.tss.setItem(reserved[i], "3.14");
            Expect(this.tss.getItem(reserved[i])).toBe(orig);
        }
    }

    @Test("Should prevent removing reserved words.")
    public shouldRejectReservedRemoves() {
        let reserved = ["getItem", "setItem", "length", "namespace", "removeItem", "key", "clear", "reserved", "storage", "models", "mapper", "_config", "formattedKey"];
        for (var i = 0; i < reserved.length; i++) {
            let orig = this.tss.getItem(reserved[i]);
            this.tss.removeItem(reserved[i]);
            Expect(this.tss.getItem(reserved[i])).toBe(orig);
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
        Expect(this.tss.getItem("one")).toBe(1.111);
        this.tss.removeItem(key);
        Expect(this.tss.getItem("one")).toBe(null);
    }

    @Test("Should prevent clearing reserved words.")
    public shouldRejectReservedClears() {
        let reserved = ["getItem", "setItem", "length", "namespace", "removeItem", "key", "clear", "reserved", "storage", "models", "mapper", "_config", "formattedKey"];
        for (var i = 0; i < reserved.length; i++) {
            let orig = this.tss.getItem(reserved[i]);
            this.tss.clear();
            Expect(this.tss.getItem(reserved[i])).toBe(orig);
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
/*describe('TypedStorageService', () => {
    beforeEach(() => {
        let config = <IConfig>{
            logger: console,
            ns: "com.example.typedstorage",
            viewModels: { }
        };
        TestBed.configureTestingModule({
            imports: [
                SimpleMapperModule.forRoot({ viewModels: { }, validateOnStartup: true, noUnmappedWarnings: false })
            ],
            providers: [
                TypedStorageService,
                { provide: "Object", useFactory: () => new Object() },
                {
                    provide: TypedStorageConfigToken, deps: ["Object"],
                    useFactory: (o) => {
                        return <IConfig>{
                            logger: console,
                            ns: "com.example.typedstorage",
                            viewModels: [],
                            storage: new MockStorage(o)
                        };
                    }
                },
                { provide: MapperLoggerToken, useValue: console }
            ]
        });
    });

    it('should create.', inject([TypedStorageService], (typedStorage: ITypedStorageService) => {
        expect(typedStorage).toBeTruthy();
    }));

    it('prevent setting reserved words.', inject([TypedStorageService], (typedStorage: ITypedStorageService) => {
        let reserved = ["getItem", "setItem", "length", "namespace", "removeItem", "key", "clear", "reserved", "storage", "vms", "mapper", "_config", "formattedKey"];
        for (var i = 0; i < reserved.length; i++) {
            let orig = typedStorage.getItem(reserved[i]);
            typedStorage.setItem(reserved[i], "3.14");
            expect(typedStorage.getItem(reserved[i])).toBe(orig);
        }
    }));
    it('prevent removing reserved words.', inject([TypedStorageService], (typedStorage: ITypedStorageService) => {
        let reserved = ["getItem", "setItem", "length", "namespace", "removeItem", "key", "clear", "reserved", "storage", "vms", "mapper", "_config"];
        for (var i = 0; i < reserved.length; i++) {
            let orig = typedStorage.getItem(reserved[i]);
            typedStorage.removeItem(reserved[i]);
            expect(typedStorage.getItem(reserved[i])).toBe(orig);
        }
    }));
    it('prevent clearing reserved words.', inject([TypedStorageService], (typedStorage: ITypedStorageService) => {
        let reserved = ["getItem", "setItem", "length", "namespace", "removeItem", "key", "clear", "reserved", "storage", "vms", "mapper", "_config"];
        for (var i = 0; i < reserved.length; i++) {
            let orig = typedStorage.getItem(reserved[i]);
            typedStorage.clear();
            expect(typedStorage.getItem(reserved[i])).toBe(orig);
        }
    }));
    it('uses namespace.', inject([TypedStorageService, "Object"], (typedStorage: ITypedStorageService, o) => {
        typedStorage.setItem("one", "1.111");
        let keys = Object.keys(o);
        expect(keys).toContain("com.example.typedstorage.one");
    }));
    it('set creates sensible typed key name.', inject([TypedStorageService, "Object"], (typedStorage: ITypedStorageService, o) => {
        let key = new TypedStorageKey<Number>(Number, "one");
        typedStorage.setItem(key, 1.111);
        let keys = Object.keys(o);
        expect(keys).toContain("com.example.typedstorage.one");
    }));
    it('set creates sensible typed key name w/o namespace.', inject([TypedStorageService, "Object"], (typedStorage: ITypedStorageService, o) => {
        let key = new TypedStorageKey<Number>(Number, "one");
        typedStorage["_config"].ns = "";
        typedStorage.setItem(key, 1.111);
        let keys = Object.keys(o);
        expect(keys).toContain("one");
    }));
    it('get/set string with string keys.', inject([TypedStorageService], (typedStorage: ITypedStorageService) => {
        typedStorage.setItem("one", "1.111");
        expect(typedStorage.getItem("one")).toBe("1.111");
    }));
    it('get/set number with typed keys.', inject([TypedStorageService], (typedStorage: ITypedStorageService) => {
        let key = new TypedStorageKey<Number>(Number, "one");
        typedStorage.setItem(key, 1.111);
        expect(typedStorage.getItem(key)).toBe(1.111);
    }));
    it('remove strings with string keys.', inject([TypedStorageService], (typedStorage: ITypedStorageService) => {
        typedStorage.setItem("one", 1.111);
        typedStorage.removeItem("one");
        expect(typedStorage.getItem("one")).toBe(null);
    }));
    it('remove strings with typed keys.', inject([TypedStorageService], (typedStorage: ITypedStorageService) => {
        let key = new TypedStorageKey<Number>(Number, "one");
        typedStorage.setItem(key, 1.111);
        expect(typedStorage.getItem("one")).toBe(1.111);
        typedStorage.removeItem(key);
        expect(typedStorage.getItem("one")).toBe(null);
    }));
    it('get/set objects with string keys.', inject([TypedStorageService], (typedStorage: ITypedStorageService) => {
        let o = { "one": 1, "two": 2 };
        typedStorage.setItem("obj", o);
        expect(typedStorage.getItem("obj")["two"]).toBe(2);

    }));
    it('get/set complex with typed keys.', inject([TypedStorageService], (typedStorage: ITypedStorageService) => {
        class Simple {
            one: number = null;
            two: number = null;
        }
        let key = new TypedStorageKey(Simple, "one");
        let o = { "one": 1, "two": 2 };
        typedStorage.setItem(key, o);
        let o2 = typedStorage.getItem(key);
        expect(o2["one"]).toBe(o.one);
        expect(o2["two"]).toBe(o.two);
    }));
    it('get/set mappable types with typed keys.', inject([TypedStorageService], (typedStorage: ITypedStorageService) => {
        class Mine {
            one: string = "one";
            get two(): string { return this.one; }
        }
        let key = new TypedStorageKey<Mine>(Mine, "one");
        typedStorage._config.viewModels = { "Mine" : Mine };
        typedStorage.setItem(key, new Mine());
        let o = typedStorage.getItem(key);
        expect(o.one).toBe("one");
        expect(o.two).toBe("one");
    }));
    it('get/set named types with typed keys.', inject([TypedStorageService], (typedStorage: ITypedStorageService) => {
        class Mine {
            one: string = "one";
            get two(): string { return this.one; }
        }
        let key = new TypedStorageKey<Mine>("Mine", "one");
        typedStorage._config.viewModels = { "Mine" : Mine };
        typedStorage.setItem(key, new Mine());
        let o = typedStorage.getItem(key);
        expect(o.one).toBe("one");
        expect(o.two).toBe("one");
    }));
    it('get/set date builtin typed keys.', inject([TypedStorageService], (typedStorage: ITypedStorageService) => {
        let key = new TypedStorageKey(Date, "one");
        typedStorage._config.viewModels = { "Date" : Date }; // should not be used.
        let d = new Date();
        typedStorage.setItem(key, d);
        let o = typedStorage.getItem(key);
        expect(o.toString()).toBe(d.toString());
    }));
    it('remove complex types with string keys.', inject([TypedStorageService], (typedStorage: ITypedStorageService) => {
        let key = new TypedStorageKey<Object>(Object, "one");
        let o = { "one": 1, "two": 2 };
        typedStorage.setItem(key, o);
        typedStorage.removeItem(key);
        let o2 = typedStorage.getItem(key);
        expect(o2).toBeNull();
    }));
    it('returns an accurate count.', inject([TypedStorageService], (typedStorage: ITypedStorageService) => {
        let key = new TypedStorageKey<Number>(Number, "one");
        let key2 = "test";
        expect(typedStorage.length).toBe(0);
        typedStorage.setItem(key, 1);
        typedStorage.setItem(key2, "one");
        expect(typedStorage.length).toBe(2);
        typedStorage.removeItem(key2);
        expect(typedStorage.length).toBe(1);
        typedStorage.clear();
        expect(typedStorage.length).toBe(0);
    }));
    it('key returns user key with namespace.', inject([TypedStorageService, "Object"], (typedStorage: ITypedStorageService, o) => {
        let key = new TypedStorageKey<Number>(Number, "one");
        let key2 = "test";
        typedStorage.setItem(key, 1);
        typedStorage.setItem(key2, "one");
        expect(typedStorage.key(0)).toBe("one");
        expect(typedStorage.key(1)).toBe("test");
    }));
    it('key returns user key without namespace.', inject([TypedStorageService, "Object"], (typedStorage: ITypedStorageService, o) => {
        let key = new TypedStorageKey<Number>(Number, "one");
        let key2 = "test";
        typedStorage._config.ns = null;
        typedStorage.setItem(key, 1);
        typedStorage.setItem(key2, "one");
        expect(typedStorage.key(0)).toBe("one");
        expect(typedStorage.key(1)).toBe("test");
    }));
    it('clear clears all.', inject([TypedStorageService], (typedStorage: ITypedStorageService) => {
        let key = new TypedStorageKey<Number>(Number, "one");
        let key2 = "test";
        typedStorage.setItem(key, 1);
        typedStorage.setItem(key2, "one");
        typedStorage.clear();
        expect(typedStorage.getItem(key)).toBeNull();
        expect(typedStorage.getItem(key2)).toBeNull();
    }));
});*/