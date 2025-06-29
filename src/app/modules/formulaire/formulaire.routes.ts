import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/formulaire/formulaire.component').then(m => m.FormulaireComponent)
  }
];