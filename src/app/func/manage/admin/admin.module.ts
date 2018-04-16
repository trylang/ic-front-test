import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { MatButtonModule, MatCardModule, MatInputModule, MatTooltipModule } from '@angular/material';

import { PaginatorModule } from '../../../tool/paginator';
import { ArkPipeModule } from '../../../tool/pipe';

import { AdminComponent } from './admin.component';
import { CaseAdminComponent } from './case';
import { EntAdminComponent } from './ent';
import { ParkAdminComponent } from './park';
import { ProductAdminComponent } from './product';
import { SolutionAdminComponent } from './solution';
import { PersonComponent } from './user/person';
import { EntComponent } from './user/ent';
import { AuditComponent } from './audit/audit.component';
import { AuditDetailComponent } from './audit/audit-detail/audit-detail.component';

const ROUTES: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: 'case', component: CaseAdminComponent, data: { animation: 'case' } },
      { path: 'ent', component: EntAdminComponent, data: { animation: 'ent' } },
      { path: 'park', component: ParkAdminComponent, data: { animation: 'park' } },
      { path: 'product', component: ProductAdminComponent, data: { animation: 'product' } },
      { path: 'solution', component: SolutionAdminComponent, data: { animation: 'solution' } },
      {
        path: 'user',
        children: [
          { path: 'person', component: PersonComponent, data: { animation: 'person' } },
          { path: 'ent', component: EntComponent, data: { animation: 'ent' } }
        ]
      },
      {
        path: 'audit',
        children: [
          { path: 'list', component: AuditComponent, data: { animation: 'list' } },
          { path: 'detail', component: AuditDetailComponent, data: { animation: 'detail' } }
        ]
      },
      { path: '', redirectTo: '/404' }
    ]
  }
];

@NgModule({
  declarations: [
    AdminComponent,
    CaseAdminComponent,
    EntAdminComponent,
    ParkAdminComponent,
    ProductAdminComponent,
    SolutionAdminComponent,
    PersonComponent,
    EntComponent,
    AuditComponent,
    AuditDetailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatTooltipModule,
    PaginatorModule,
    ArkPipeModule,
    RouterModule.forChild(ROUTES)
  ],
  exports: [],
  providers: []
})
export class AdminModule {}
