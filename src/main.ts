import './polyfills.ts';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import { TypedStorageModule } from './app/typed-storage.module';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(TypedStorageModule);