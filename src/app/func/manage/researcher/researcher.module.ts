import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import {
  MatButtonModule,
  MatCardModule,
  MatIconModule,
  MatInputModule,
  MatTooltipModule
} from '@angular/material';

import { PaginatorModule } from '../../../tool/paginator';

import { ResearcherComponent } from './researcher.component';
import { CaseComponent } from './case';
import { EntComponent } from './ent';
import { ParkComponent } from './park';
import { ProductComponent } from './product';
import { SolutionComponent } from './solution';

const ROUTES: Routes = [
  { path: '', component: ResearcherComponent, children: [
    { path: 'case', component: CaseComponent, data: { animation: 'case'} },
    { path: 'ent', component: EntComponent, data: { animation: 'ent'} },
    { path: 'park', component: ParkComponent, data: { animation: 'park'}},
    { path: 'product', component: ProductComponent, data: { animation: 'product'} },
    { path: 'solution', component: SolutionComponent, data: { animation: 'soluiton'} },
    { path: '', redirectTo: '/404'}
  ] },
];

@NgModule({
  declarations: [
    ResearcherComponent,
    CaseComponent,
    EntComponent,
    ParkComponent,
    ProductComponent,
    SolutionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule,
    PaginatorModule,
    RouterModule.forChild(ROUTES)
  ],
  exports: [],
  providers: [],
})
export class ResearcherModule {}
