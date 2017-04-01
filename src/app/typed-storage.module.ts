import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapperService, MapperServiceToken, MapperConfiguration, IConfig as IMapperConfiguration } from 'simple-mapper';
import { TypedStorageService, TypedStorageConfigToken } from './services/typed-storage.service';
import { typedStorageFactory } from './services/typed-storage-factory';
import { IConfig } from './services/i';

export * from './services/typed-storage.service';
export * from './services/typed-storage-key';
export * from './services/i';
//export * from './decorators/mappable.decorator';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  exports: []
})
export class TypedStorageModule {
  static forRoot(config: IConfig): ModuleWithProviders {
    return {
      ngModule: TypedStorageModule,
      providers: [
        TypedStorageService,
        { provide: TypedStorageConfigToken, useValue: config },
        { provide: TypedStorageService, useFactory: typedStorageFactory, deps: [TypedStorageConfigToken, MapperServiceToken] },
        { provide: MapperConfiguration, useValue: <IMapperConfiguration>{ viewModels: config.viewModels, logger: config.logger }},
        { provide: MapperServiceToken, useClass: MapperService }
      ]
    };
  }
}