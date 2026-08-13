import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { ProductRepository } from './features/products/repositories/product.repository';
import { LocalStorageProductRepository } from './features/products/repositories/local-storage-product.repository';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    {
      provide: ProductRepository,
      useExisting: LocalStorageProductRepository
    }
  ]
};
