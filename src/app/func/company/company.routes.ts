import { Routes, RouterModule } from '@angular/router';

import { CompanySearchComponent } from './company-search/company-search.component';
import { CompanyDetailComponent } from './company-detail/company-detail.component';

export const CompanyRoutes = [
  { path: 'search', component: CompanySearchComponent},
  { path: 'detail', component: CompanyDetailComponent}
];

