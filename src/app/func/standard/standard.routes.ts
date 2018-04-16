import { Routes } from '@angular/router';

import { StandardSearchComponents } from './search/standard-search.component';
import { StandardDetailsComponents } from './details/standard-details.component';

export const StandardRoutes: Routes = [
  {
    path: '',
    children: [{
      path: 'search',
      component: StandardSearchComponents
    }, {
      path: 'detail',
      component: StandardDetailsComponents
    }]
  }
];
