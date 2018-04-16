import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MatTooltipModule, MatCheckboxModule } from '@angular/material';

import { PaginatorModule } from '../../../../tool/paginator/paginator.module';
import { ArkPipeModule } from '../../../../tool/pipe';
import { NgxCropperModule } from 'ngx-cropper';
import { ArkDirectiveModule } from '../../../../tool/directive';
import { CKEditorModule } from 'ng2-ckeditor';
import { EntTypeModule } from '../../../manage/public/ent-edit/ent-type';

import { EntComponent } from './main/ent.component';
import { EntMsgComponent } from './message/ent-msg.component';
import { ListBoxComponents } from './listbox/listbox.component';

import { EntHttpServer } from './service/ent-http.service';
import { EntServer } from './service/ent.service';

const ROUTES: Routes = [
  {
    path: '', component: EntComponent, children: [
      { path: 'message', component: EntMsgComponent },
      { path: 'case', component: ListBoxComponents },
      { path: 'goods', component: ListBoxComponents },
      { path: 'scheme', component: ListBoxComponents }
    ]
  }
];

@NgModule({
  declarations: [
    EntComponent,
    EntMsgComponent,
    ListBoxComponents,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatTooltipModule,
    CKEditorModule,
    PaginatorModule,
    ArkPipeModule,
    NgxCropperModule,
    ArkDirectiveModule,
    MatCheckboxModule,
    EntTypeModule,
    RouterModule.forChild(ROUTES)
  ],
  providers: [
    EntHttpServer,
    EntServer
  ]
})
export class EntModule { }
