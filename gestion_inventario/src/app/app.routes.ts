import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { UnauthGuard } from './guards/unauth-guard.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/login/login.component'),
    pathMatch: 'full',
    canActivate: [UnauthGuard],
  },
  {
    path: 'register',
    loadComponent: () => import('./components/register/register.component'),
    canActivate: [UnauthGuard], 
  },
  {
    path: 'home',
    loadComponent: () => import('./components/layout/layout.component'),
    children: [
      {
        path: 'electronicComponent',
        loadComponent: () => import('./pages/admin/electronic-component/electronic-component.component'),
        canActivate: [AuthGuard],
        data: { role: 'admin' },
      },
      {
        path: 'request',
        loadComponent: () => import('./pages/admin/request/request.component'),
        canActivate: [AuthGuard],
        data: { role: 'admin' },
      },
      {
        path: 'loans',
        loadComponent: () => import('./pages/admin/loans/loans.component'),
        canActivate: [AuthGuard],
        data: { role: 'admin' },
      },
      {
        path: 'viewComponents',
        loadComponent: () => import('./pages/user/view-components/view-components.component'),
        canActivate: [AuthGuard],
        data: { role: 'user' },
      },
      {
        path: 'loansSummary',
        loadComponent: () => import('./pages/user/loans-summary/loans-summary.component'),
        canActivate: [AuthGuard],
        data: { role: 'user' },
      },
      {
        path: '',
        redirectTo: 'electronicComponent',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];