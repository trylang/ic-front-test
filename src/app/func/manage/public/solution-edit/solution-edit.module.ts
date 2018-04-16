import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MatCardModule, MatButtonModule } from '@angular/material';
import { CKEditorModule } from 'ng2-ckeditor';
import { NgxCropperModule } from 'ngx-cropper';
import { ArkPipeModule } from '../../../../tool/pipe';
import { TreeModule } from 'primeng/primeng';
import { ArkDirectiveModule } from '../../../../tool/directive';

import { ClaimeEntModule } from '../claime-ent';
import { SolutionEditComponent } from './solution-edit.component';
import { ClaimeProductModule } from './claime-product';
import { SolutionDeactivateGuard } from './solution-deactivate-guard.service';

const ROUTES: Routes = [{ path: '', component: SolutionEditComponent, canDeactivate: [SolutionDeactivateGuard] }];

@NgModule({
  declarations: [SolutionEditComponent],
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
    RouterModule.forChild(ROUTES),
    ClaimeProductModule,
    ArkDirectiveModule
  ],
  exports: [],
  providers: [SolutionDeactivateGuard]
})
export class SolutionEditModule {}
