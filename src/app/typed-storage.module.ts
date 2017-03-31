import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimpleMapperModule } from 'simple-mapper';
import { TypedStorageService } from './services/typed-storage.service';
import { typedStorageFactory } from './services/typed-storage-factory';
import { IConfig } from './services/i';

export * from './services/typed-storage.service';
export * from './services/i';
//export * from './decorators/mappable.decorator';

@NgModule({
  imports: [
    CommonModule,
    SimpleMapperModule.forRoot({ viewModels: [] })
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
        { provide: TypedStorageService, useFactory: typedStorageFactory, deps: [config] }
      ]
    };
  }
}