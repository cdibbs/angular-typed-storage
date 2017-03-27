/* tslint:disable:no-unused-variable */
import { ClassProvider, ValueProvider } from '@angular/core';
import { TestBed, async, inject } from '@angular/core/testing';
import { Observable } from 'rxjs';

import { TypedStorage } from './typed-storage.service';
import { TypedStorageKey } from './typed-storage-key';
import * as vm from '../test-resources/view-models';
import { IConfig } from './i';

describe('MapperService', () => {
  beforeEach(() => {
    let config = <IConfig>{
        logger: console,
        viewModels: vm
    };
    TestBed.configureTestingModule({
        providers: [
            TypedStorage,
            //<ValueProvider>{ provide: MapperConfiguration, useValue: config }
        ]
    });
  });

  it('should create.', inject([TypedStorage], (storage: TypedStorage) => {
    let s: Storage = storage;
    expect(storage).toBeTruthy();
  }));

  describe('MapJsonToVM', () =>  {
    it('should map basic primitives.', inject([TypedStorage], (mapper: TypedStorage) => {
        class Mine {
            Id: number = 3;
            One: string = "string";
            Two: number = 3.14;
            Three: string = null;
        }
        var json = {
            Id: 3,
            One: "something else",
            Two: 6.53,
            Three: "another"
        };
        var result = mapper.MapJsonToVM(vm.Mine, json);
        expect(result.Id).toBe(3);
        expect(result.One).toBe(json.One);
        expect(result.Two).toBe(json.Two);
        expect(result.Three).toBe(json.Three);
    }));
    it('should ignore extraneous source properties when unmappedWarning is false.',
    inject([TypedStorage], (mapper: TypedStorage) => {
        var warned = null;
        mapper["log"].warn = function(yep) { warned = yep; };
        var json = {
            Id: 3,
            One: "something else",
            Two: 6.53, // ignored
        };
        var result = mapper.MapJsonToVM(vm.MineMinusTwo, json, false);
        expect(result.Id).toBe(3);
        expect(result.One).toBe(json.One);
        expect(result["Two"]).toBeUndefined();
        expect(warned).toBeNull();
    }));
    it('should warn when extraneous source properties.',
    inject([TypedStorage], (mapper: TypedStorage) => {
        var warned = null;
        mapper["log"].warn = function(yep) { warned = yep; };
        var json = {
            Id: 3,
            One: "something else",
            Two: 6.53, // ignored
        };
        var result = mapper.MapJsonToVM(vm.MineMinusTwo, json);
        expect(result.Id).toBe(3);
        expect(result.One).toBe(json.One);
        expect(result["Two"]).toBeUndefined();
        expect(warned).toBeTruthy();
    }));
    it('should map nested types.', inject([TypedStorage], (mapper: TypedStorage) => {
        var json = {
            Id: 3,
            One: "something else",
            Prop: {
                Another: "for you"
            }
        };
        var result = mapper.MapJsonToVM(vm.Nested_Mine, json);
        expect(result.Id).toBe(3);
        expect(result.One).toBe(json.One);
        expect(result.Prop).toBeDefined();
        expect(result.Prop.Another).toBe(json.Prop.Another);
        expect(result.Prop.Computed).toBe("for you and me");
    }));

    it('should map nested types under an observable.', inject([TypedStorage], (mapper: TypedStorage) => {
        var json = {
            Id: 3,
            One: "something else",
            Prop: {
                Another: "for you"
            }
        };
        Observable.from([json]).delay(100).subscribe(j => {
            var result = mapper.MapJsonToVM(vm.Observable_Mine, json);
            expect(result.Id).toBe(3);
            expect(result.One).toBe(json.One);
            expect(result.Prop).toBeDefined();
            expect(result.Prop.Another).toBe(json.Prop.Another);
            expect(result.Prop.Computed).toBe("for you and me");
        });
    }));
    it('should map nested array types.', inject([TypedStorage], (mapper: TypedStorage) => {
        var json = {
            Id: 3,
            One: "something else",
            Props: [{
                Another: "for you"
            }, {
                Another: "for me"
            }]
        };
        var result = mapper.MapJsonToVM(vm.NestedArrayTypes_Mine, json);
        expect(result.Id).toBe(3);
        expect(result.One).toBe(json.One);
        expect(result.Props).toBeDefined();
        expect(result.Props.length).toBe(2);
        expect(result.Props[0].Computed).toBe("for you and me");
        expect(result.Props[1].Computed).toBe("for me and me");
    }));
  });
});