import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
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

import { MultiSelectModule, TreeModule } from 'primeng/primeng';

import { CKEditorModule } from 'ng2-ckeditor';
import { NgxCropperModule } from 'ngx-cropper';
import { ArkPipeModule } from '../../../tool/pipe';
import { PaginatorModule } from '../../../tool/paginator';
import { PasswordModule } from '../../account/password/password.module';

import { EntDeactivateGuard } from './ent-edit/ent-deactivate-guard.service';

import { PublicComponent } from './public.component';
import { EntEditComponent } from './ent-edit';
// import { EntEditDirective } from './ent-edit/ent-edit.directive';
import { EntTypeModule } from './ent-edit/ent-type';
import { ArkDirectiveModule } from '../../../tool/directive';

import { InfoComponent } from './info';

const ROUTES: Routes = [
  {
    path: '',
    component: PublicComponent,
    children: [
      { path: 'case/edit', loadChildren: './case-edit/case-edit.module#CaseEditModule', data: { aimation: 'case' } },
      { path: 'ent/edit', component: EntEditComponent, canDeactivate: [EntDeactivateGuard], data: { animation: 'ent' } },
      { path: 'park/edit', loadChildren: './park-edit/park-edit.module#ParkEditModule' },
      {
        path: 'product/edit',
        loadChildren: './product-edit/product-edit.module#ProductEditModule',
        data: { animation: 'product' }
      },
      {
        path: 'solution/edit',
        loadChildren: './solution-edit/solution-edit.module#SolutionEditModule',
        data: { animation: 'solution' }
      },
      { path: 'info', component: InfoComponent, data: { animation: 'info' } },
      { path: '', redirectTo: '/404' }
    ]
  }
];

@NgModule({
  declarations: [PublicComponent, EntEditComponent, InfoComponent],
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
    EntTypeModule,
    PasswordModule,
    ArkDirectiveModule,
    RouterModule.forChild(ROUTES)
  ],
  exports: [],
  providers: [EntDeactivateGuard]
})
export class PublicModule {}
