import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { MatCardModule, MatButtonModule, MatIconModule } from '@angular/material';

import { ArkPipeModule } from '../../../tool/pipe';
import { ImageUploadModule } from 'angular2-image-upload';
import { NgxCropperModule } from 'ngx-cropper';
import { PaginatorModule } from '../../../tool/paginator';
import { ParkEditModule } from '../../manage/public/park-edit/park-edit.module';

import { AuthGuard } from './auth-guard.service';

import { TableModule } from '../../../tool/table/table.module';
import { ArkDirectiveModule } from '../../../tool/directive';
import { CheckComponent } from './check/check.component';
import { ParkComponent } from './park';
import { AnalyzeComponent } from './analyze';

const ROUTES: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      { path: 'check', component: CheckComponent },
      { path: 'owner', component: ParkComponent },
      { path: 'analyze', component: AnalyzeComponent },
      { path: '', redirectTo: '/404' }
    ]
  }
];

@NgModule({
  declarations: [CheckComponent, ParkComponent, AnalyzeComponent],
  imports: [
    CommonModule,
    ArkPipeModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    ImageUploadModule.forRoot(),
    FormsModule,
    NgxCropperModule,
    PaginatorModule,
    ParkEditModule,
    TableModule,
    ArkDirectiveModule,
    RouterModule.forChild(ROUTES)
  ],
  exports: [],
  providers: [
    AuthGuard
  ]
})
export class ParkUserModule {}
