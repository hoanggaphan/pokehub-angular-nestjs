import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import AuthGuard from './guards/auth.guard';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { PrimaryLayout } from './layout/primary-layout/primary-layout';

export const routes: Routes = [
    {
        path: '',
        component: PrimaryLayout,
        children: [
            {
                title: 'Home page',
                path: '',
                component: Home
            },
            {
                title: 'Pokemon List Page',
                path: 'pokemon',
                loadComponent: () => import('./pages/poke-list/poke-list').then(m => m.PokeList),
            },
        ]
    },
    {
        title: 'Login Page',
        path: 'login',
        component: Login,
        canActivate: [AuthGuard],
    },
    {
        title: 'Register Page',
        path: 'register',
        component: Register,
    },
    { title: 'Not Found Page', path: '**', loadComponent: () => import('./pages/not-found/not-found').then(m => m.NotFound) }
];
