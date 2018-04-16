import { Routes, RouterModule } from '@angular/router';

import { SolutionSearchComponent } from './solution-search/solution-search.component';
import { SolutionDetailComponent } from './solution-detail/solution-detail.component';
import { SolutionCaseComponent } from './solution-case/solution-case.component';

export const SolutionRoutes: Routes = [
  { path: 'search', component: SolutionSearchComponent },
  { path: 'detail', component: SolutionDetailComponent },
  { path: 'detail/case', component: SolutionCaseComponent },
  { path: '', redirectTo: '/404' }
];
