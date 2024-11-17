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
                path: 'viewComponents',
                loadComponent: () => import('./pages/user/view-components/view-components.component')
            },
            {
                path: 'loansSummary',
                loadComponent: () => import('./pages/user/loans-summary/loans-summary.component')
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
