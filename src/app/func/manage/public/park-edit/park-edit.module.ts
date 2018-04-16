import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import {
  MatCardModule,
  MatDialogModule,
  MatButtonModule,
  MatIconModule,
  MatTabsModule,
  MatTooltipModule,
  MatDatepickerModule,
  MatInputModule,
  MatNativeDateModule
} from '@angular/material';

import { MultiSelectModule, TreeModule  } from 'primeng/primeng';
import { CKEditorModule } from 'ng2-ckeditor';
import { NgxCropperModule } from 'ngx-cropper';
import { ArkPipeModule } from '../../../../tool/pipe';
import { PaginatorModule } from '../../../../tool/paginator';

import { ParkEditComponent } from './park-edit.component';

import { AdvantageComponent } from './advantage';
import { BasicComponent } from './basic';
import { CompanyComponent } from './company';
import { PreferentialComponent } from './preferential';
import { PropertyComponent } from './property';

import { AddBrandModule } from './advantage/add-brand';
import { AddEntModule } from './company/add-ent';
import { AddPropertyModule } from './property/add-property';

import { ManageService } from '../../manage.service';

const ROUTES: Routes = [
  {path: '', component: ParkEditComponent }
];

@NgModule({
  declarations: [
    ParkEditComponent,
    AdvantageComponent,
    BasicComponent,
    CompanyComponent,
    PreferentialComponent,
    PropertyComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatIconModule,
    MatTabsModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MultiSelectModule,
    TreeModule,
    NgxCropperModule,
    CKEditorModule,
    ArkPipeModule,
    PaginatorModule,
    AddBrandModule,
    AddEntModule,
    AddPropertyModule,
    RouterModule.forChild(ROUTES)
   ],
  exports: [
    AdvantageComponent,
    BasicComponent,
    CompanyComponent,
    PreferentialComponent,
    PropertyComponent
  ],
  providers: [
    ManageService
  ],
})
export class ParkEditModule {}
