/* tslint:disable:no-unused-variable */
import { TestBed, async, inject } from '@angular/core/testing';
import { SimpleMapperModule, IMapperService, MapperService, MapperServiceToken } from 'simple-mapper';

import { MockStorage } from './mock/mock.storage';
import { typedStorageFactory } from './typed-storage-factory';
import { TypedStorageKey } from './typed-storage-key';
import * as vm from '../test-resources/view-models';
import { IConfig } from './i';

describe('TypedStorageFactory', () => {
  beforeEach(() => {
    let config = <IConfig>{
        logger: console,
        viewModels: vm
    };
    TestBed.configureTestingModule({
        imports: [
            SimpleMapperModule.forRoot({viewModels: vm})
        ],
        providers: [
        ]
    });
  });

  it('should generate proxied, typed storage.', inject([MapperService], (mapper: IMapperService) => {
    let o = {};
    let s = typedStorageFactory({ storage: new MockStorage(o) }, mapper);
    s.setItem("one", "two");
    expect(s["one"]).toBe(s.getItem("one"));
    expect(s.getItem("one")).toBe("two");
  }));
  it('should pass prop set through to setItem.', inject([MapperService], (mapper: IMapperService) => {
    let o = {};
    let s = typedStorageFactory({ storage: new MockStorage(o) }, mapper);
    s.setItem("one", "two");
    expect(s["one"]).toBe(s.getItem("one"));
    expect(s.getItem("one")).toBe("two");
  }));
  it('should pass prop access through to getItem.', inject([MapperService], (mapper: IMapperService) => {
    let o = {};
    let s = typedStorageFactory({ storage: new MockStorage(o) }, mapper);
    s.setItem("one", "two");
    expect(s["one"]).toBe(s.getItem("one"));
    expect(s.getItem("one")).toBe("two");
  }));
  it('should pass prop delete through to removeItem.', inject([MapperService], (mapper: IMapperService) => {
    let o = {};
    let s = typedStorageFactory({ storage: new MockStorage(o) }, mapper);
    s.setItem("one", "two");
    expect(s["one"]).toBe(s.getItem("one"));
    expect(s.getItem("one")).toBe("two");
  }));
});