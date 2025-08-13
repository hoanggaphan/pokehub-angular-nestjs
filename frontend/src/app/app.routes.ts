import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { NotFound } from './pages/not-found/not-found';
import { PokeList } from './pages/poke-list/poke-list';

export const routes: Routes = [
    {
        path: '',
        component: Home,
        title: 'Home Page'
    },
    {
        path: 'pokemon-list',
        component: PokeList,
        title: 'Pokemon List Page'
    },
    { path: '**', component: NotFound }
];
