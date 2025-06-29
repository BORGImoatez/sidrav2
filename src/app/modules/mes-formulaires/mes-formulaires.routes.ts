import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/mes-formulaires/mes-formulaires.component').then(m => m.MesFormulairesComponent)
  }
];