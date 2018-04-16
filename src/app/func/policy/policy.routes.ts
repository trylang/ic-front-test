import { Routes } from '@angular/router';

import { PolicySearchComponents } from './search/policy-search.component';
import { PolicyDetailsComponents } from './details/policy-details.component';

export const PolicyRoutes: Routes = [
  {
    path: '',
    children: [{
      path: 'search',
      component: PolicySearchComponents
    }, {
      path: 'detail',
      component: PolicyDetailsComponents
    }]
  }
];
