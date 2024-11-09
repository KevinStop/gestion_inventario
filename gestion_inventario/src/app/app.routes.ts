import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./components/layout/layout.component'),
        children: [
            {
                path: 'electronicComponent',
                loadComponent: () => import('./pages/admin/electronic-component/electronic-component.component')
            },
            {
                path: 'request',
                loadComponent: () => import('./pages/admin/request/request.component')
            },
            {
                path: 'loans',
                loadComponent: () => import('./pages/admin/loans/loans.component')
            },
            {
                path: '',
                redirectTo: 'electronicComponent',
                pathMatch: 'full'
            }

        ]
    },
    {
        path: '**',
        redirectTo: 'electronicComponent'
    }
];
