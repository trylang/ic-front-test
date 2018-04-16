import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { PatentsSearchComponents } from './search/patents-search.component';
import { PatentsDetailsComponents } from './details/patents-details.component';

import { HeaderModule } from '../header';
import { HeaderSearchModule } from '../header-search';
import { FooterModule } from '../footer';
import { AddCollectModule } from '../add-collect';
import { ArkPipeModule } from '../../tool/pipe';
import { PaginatorModule } from '../../tool/paginator/paginator.module';
import { ShareModule } from '../../tool/share';
import { DataNotFoundModule } from '../data-not-found';
import { ArkDirectiveModule } from '../../tool/directive';

import { PatentsDetailService } from './service/patents-details.service';
import { PatentsServer } from './service/patents.service';
import { PatentsRoutes } from './patents.routes';

@NgModule({
  declarations: [
    PatentsSearchComponents,
    PatentsDetailsComponents
  ],
  imports: [
    CommonModule,
    FormsModule,
    ArkPipeModule,
    ArkDirectiveModule,
    PaginatorModule,
    ShareModule,
    DataNotFoundModule,
    AddCollectModule,
    HeaderModule,
    HeaderSearchModule,
    FooterModule,
    RouterModule.forChild(PatentsRoutes)
  ],
  providers: [PatentsServer, PatentsDetailService]
})
export class PatentsModule { }
