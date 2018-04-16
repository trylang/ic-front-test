import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import {
  MatCardModule,
  MatButtonModule,
  MatDatepickerModule,
  MatNativeDateModule
 } from '@angular/material';
import { CKEditorModule } from 'ng2-ckeditor';
import { NgxCropperModule } from 'ngx-cropper';
import { ArkPipeModule } from '../../../../tool/pipe';
import { TreeModule } from 'primeng/primeng';
import { ClaimeEntModule } from '../claime-ent';

import { CaseEditComponent } from './case-edit.component';
import { CaseDeactivateGuard } from './case-deactivate-guard.service';

const ROUTES: Routes = [
  {path: '', component: CaseEditComponent, canDeactivate: [CaseDeactivateGuard] }
];

@NgModule({
  declarations: [
    CaseEditComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CKEditorModule,
    NgxCropperModule,
    ArkPipeModule,
    TreeModule,
    ClaimeEntModule,
    RouterModule.forChild(ROUTES),
  ],
  exports: [],
  providers: [
    CaseDeactivateGuard
  ],
})
export class CaseEditModule {}
