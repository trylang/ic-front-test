import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import {
  MatCardModule,
  MatButtonModule
 } from '@angular/material';
import { CKEditorModule } from 'ng2-ckeditor';
import { NgxCropperModule } from 'ngx-cropper';
import { ArkPipeModule } from '../../../../tool/pipe';
import { TreeModule } from 'primeng/primeng';
import { ClaimeEntModule } from '../claime-ent';
import { ArkDirectiveModule } from '../../../../tool/directive';

import { ProductEditComponent } from './product-edit.component';
import { ProductDeactivateGuard } from './product-deactivate-guard.service';
import { ClaimeSolutionModule } from './claime-solution';

const ROUTES: Routes = [
  {path: '', component: ProductEditComponent, canDeactivate: [ProductDeactivateGuard] }
];

@NgModule({
  declarations: [
    ProductEditComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    CKEditorModule,
    NgxCropperModule,
    ArkPipeModule,
    TreeModule,
    ClaimeEntModule,
    ArkDirectiveModule,
    RouterModule.forChild(ROUTES),
    ClaimeSolutionModule
  ],
  exports: [],
  providers: [
    ProductDeactivateGuard
  ],
})
export class ProductEditModule {}
