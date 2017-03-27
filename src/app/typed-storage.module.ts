import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimpleMapperModule } from 'simple-mapper';
import { TypedStorage } from './services/typed-storage.service';
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
        TypedStorage,
        { provide: TypedStorage, useClass: TypedStorage },
        //{ provide: MapperConfiguration, useValue: config }
      ]
    };
  }
}