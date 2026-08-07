import { Routes } from '@angular/router';

import { Layout } from './layout/layout/layout';
import { dashboardRoutes } from './features/dashboard/dashboard.routes';
import { productsRoutes } from './features/products/products.routes';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      ...dashboardRoutes,
      ...productsRoutes
    ]
  }
];
