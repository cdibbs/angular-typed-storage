/* tslint:disable:no-unused-variable */
import { ClassProvider, ValueProvider } from '@angular/core';
import { TestBed, async, inject } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { SimpleMapperModule } from 'simple-mapper';

import { TypedStorageModule } from './typed-storage.module';
import { TypedStorageService } from '../services/typed-storage.service';
import { IConfig, TypedStorageLoggerToken, ILogService } from '../services/i';

describe('TypedStorageModule without user logger', () => {
    beforeEach(() => {
        let config = <IConfig>{
            viewModels: {}
        };
        let providers = TypedStorageModule.forRoot(config).providers
        //providers.push({ provide: MapperLoggerToken, useValue: console })
        TestBed.configureTestingModule({
            imports: [
                SimpleMapperModule.forRoot({})
            ],
            providers: providers
        });
    });

    it('providers should work without error.', inject([TypedStorageService], (storage: TypedStorageService) => {
        expect(storage).toBeDefined();
    }));

    it('should use user-injected logger.', inject([TypedStorageLoggerToken], (logger: ILogService) => {
        expect(logger).toBe(console);
    }));
});

describe('TypedStorageModule with user logger', () => {
    class MockConsole {
        public error(message?: any, ...optional: any[]): void { }
        public log(message?: any, ...optional: any[]): void { }
        public warn(message?: any, ...optional: any[]): void { }
        public info(message?: any, ...optional: any[]): void { }
    }
    let mockCon = new MockConsole();
    beforeEach(() => {
        let config = <IConfig>{
            viewModels: {}
        };
        let providers = TypedStorageModule.forRoot(config).providers
        providers.push({ provide: TypedStorageLoggerToken, useValue: mockCon })
        TestBed.configureTestingModule({
            imports: [
                SimpleMapperModule.forRoot({})
            ],
            providers: providers
        });
    });

    it('should use user-injected logger.', inject([TypedStorageLoggerToken], (logger: ILogService) => {
        expect(logger).toBe(mockCon);
    }));
});
