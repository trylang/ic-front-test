import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './auth-guard.service';
import { ManageComponent } from './manage.component';

const ROUTES: Routes = [
  {
    path: '',
    component: ManageComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        children: [
          { path: 'admin', loadChildren: './admin/admin.module#AdminModule', canActivateChild: [AuthGuard] },
          { path: 'researcher', loadChildren: './researcher/researcher.module#ResearcherModule' },
          { path: 'public', loadChildren: './public/public.module#PublicModule' }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class ManageRoutingModule {}
