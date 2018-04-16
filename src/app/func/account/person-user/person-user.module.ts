import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { MatCardModule, MatButtonModule, MatIconModule } from '@angular/material';

import { NgxCropperModule } from 'ngx-cropper';
import { PaginatorModule } from '../../../tool/paginator';
import { ArkPipeModule } from '../../../tool/pipe';
import { TableModule } from '../../../tool/table/table.module';

import { CollectService } from '../collect/collect.service';

const ROUTES: Routes = [
  { path: 'macro', loadChildren: './macro/macro.module#MacroModule' },
  { path: '', redirectTo: '/404'}
];

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    FormsModule,
    NgxCropperModule,
    PaginatorModule,
    ArkPipeModule,
    TableModule,
    RouterModule.forChild(ROUTES)
  ],
  exports: [],
  providers: [
    CollectService,
  ],
})
export class PersonUserModule {}
