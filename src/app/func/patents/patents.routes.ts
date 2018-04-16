import { Routes } from '@angular/router';


import { PatentsSearchComponents } from './search/patents-search.component';
import { PatentsDetailsComponents } from './details/patents-details.component';

export const PatentsRoutes: Routes = [
  {
    path: '',
    children: [{
      path: 'search',
      component: PatentsSearchComponents
    }, {
      path: 'detail',
      component: PatentsDetailsComponents
    }]
  }
];
