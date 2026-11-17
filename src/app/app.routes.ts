import { Home } from './features/home/home';
import { Notebook } from './features/notebook/notebook';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: "",
    component: Home,
  }, 
  {
    path: 'notebook/:id',
    component: Notebook,
  },
  {
    path: '**',
    redirectTo: '',
  }
];
