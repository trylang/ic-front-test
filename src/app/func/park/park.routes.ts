import { Routes, RouterModule } from '@angular/router';

import { ParkListComponent } from './park-search/park-search.component';
import { ParkDetailComponent } from './park-detail/park-detail.component';

export const ParkRoutes: Routes = [
  { path: 'search', component: ParkListComponent },
  { path: 'detail', component: ParkDetailComponent },
  { path: '', redirectTo: '/404' }
];
