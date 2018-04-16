import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { MatDialogModule, MatCardModule, MatButtonModule, MatIconModule, MatCheckboxModule } from '@angular/material';
import { NgxCropperModule } from 'ngx-cropper';
import { PaginatorModule } from '../../../tool/paginator';
import { ArkPipeModule } from '../../../tool/pipe';
import { CheckComponent } from './check/check.component';
import { TableModule } from '../../../tool/table/table.module';
import { RelationModule } from '../../../tool/chart/relation';
import { EntityRelationModule } from '../../../tool/chart/entity-relation';
import { EntTypeModule } from '../../manage/public/ent-edit/ent-type';
import { ArkDirectiveModule } from '../../../tool/directive';

import { AuthGuard } from './auth-guard.service';

const ROUTES: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      { path: 'ent', loadChildren: './ent/ent.module#EntModule' },
      { path: 'check', component: CheckComponent },
      { path: '', redirectTo: '/404' }
    ]
  }
];

@NgModule({
  declarations: [CheckComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    FormsModule,
    NgxCropperModule,
    PaginatorModule,
    ArkPipeModule,
    TableModule,
    RelationModule,
    EntTypeModule,
    EntityRelationModule,
    ArkDirectiveModule,
    RouterModule.forChild(ROUTES)
  ],
  exports: [],
  providers: [AuthGuard]
})
export class EntUserModule {}
