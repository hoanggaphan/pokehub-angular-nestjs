import { Routes } from '@angular/router';
import { Home } from './pages/home/home';

export const routes: Routes = [
    {
        path: '',
        component: Home,
        title: 'Home Page'
    },
    {
        path: 'pokemon-list',
        loadComponent: () => import('./pages/poke-list/poke-list').then(m => m.PokeList),
        title: 'Pokemon List Page'
    },
    { path: '**', loadComponent: () => import('./pages/not-found/not-found').then(m => m.NotFound) }
];
