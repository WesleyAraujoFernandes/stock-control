import { Routes } from '@angular/router';

import { ProductListPage } from './pages/product-list-page/product-list-page';
import { ProductCreatePage } from './pages/product-create-page/product-create-page';
import { ProductEditPage } from './pages/product-edit-page/product-edit-page';

export const productsRoutes: Routes = [
  {
    path: 'products',
    component: ProductListPage,
  },
  {
    path: 'products/new',
    component: ProductCreatePage
  },
  {
    path: 'products/:id/edit',
    component: ProductEditPage
  }
];
