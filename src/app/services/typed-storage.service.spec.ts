/* tslint:disable:no-unused-variable */
import { ClassProvider, ValueProvider } from '@angular/core';
import { TestBed, async, inject } from '@angular/core/testing';
import { Observable } from 'rxjs';

import { SimpleMapperModule, IMapperService, MapperService } from 'simple-mapper';
import { MockStorage } from './mock/mock.storage';
import { TypedStorageService, TypedStorageConfigToken } from './typed-storage.service';
import { TypedStorageKey } from './typed-storage-key';
import * as vm from '../test-resources/view-models';
import { IConfig, ITypedStorageService } from './i';

describe('TypedStorageService', () => {
    beforeEach(() => {
        let config = <IConfig>{
            logger: console,
            ns: "com.example.typedstorage",
            viewModels: vm
        };
        TestBed.configureTestingModule({
            imports: [
                SimpleMapperModule.forRoot({ viewModels: vm })
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
                            viewModels: vm,
                            storage: new MockStorage(o)
                        };
                    }
                }
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
        let key = new TypedStorageKey<Object>(Object, "one");
        let o = { "one": 1, "two": 2 };
        typedStorage.setItem(key, o);
        let o2 = typedStorage.getItem(key);
        expect(o.one).toBe(o2["one"]);
        expect(o.two).toBe(o2["two"]);
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
        console.log("here", typedStorage.key(0));
        expect(typedStorage.length).toBe(0);
    }));
    it('keys returns each key sans namespace.', inject([TypedStorageService, "Object"], (typedStorage: ITypedStorageService, o) => {
        let key = new TypedStorageKey<Number>(Number, "one");
        let key2 = "test";
        typedStorage.setItem(key, 1);
        typedStorage.setItem(key2, "one");
        console.log(o);
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
});