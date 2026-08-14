import { Routes } from '@angular/router';
import { TripsComponent } from './trips/trips.component';
import { TripEditComponent } from './trip-edit/trip-edit';
import { TripCreateComponent } from './trip-create/trip-create';

export const routes: Routes = [
  { path: '', redirectTo: 'trips', pathMatch: 'full' },

  { path: 'trips', component: TripsComponent },

  { path: 'trips/new', component: TripCreateComponent },

  { path: 'trips/:code', component: TripEditComponent },

  { path: '**', redirectTo: 'trips' }
];
