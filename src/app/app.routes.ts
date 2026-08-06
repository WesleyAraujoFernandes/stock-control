import { Routes } from '@angular/router';

import { Layout } from './layout/layout/layout';
import { Dashboard } from './features/dashboard/dashboard';
import { dashboardRoutes } from './features/dashboard/dashboard.routes';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      ...dashboardRoutes
    ]
  }
];
