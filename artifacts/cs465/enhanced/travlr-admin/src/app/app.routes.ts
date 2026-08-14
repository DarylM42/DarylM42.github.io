import { Routes } from '@angular/router';
import { TripsComponent } from './trips/trips.component';
import { TripEditComponent } from './trip-edit/trip-edit';
import { TripCreateComponent } from './trip-create/trip-create';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'trips', pathMatch: 'full' },

  { 
    path: 'trips', 
    component: TripsComponent,
    canActivate: [authGuard]
  },

  { 
    path: 'trips/new', 
    component: TripCreateComponent,
    canActivate: [authGuard]
  },

  { 
    path: 'trips/:code', 
    component: TripEditComponent,
    canActivate: [authGuard]
  },

  { 
    path: 'login', 
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
  },

  { path: '**', redirectTo: 'trips' }
];
