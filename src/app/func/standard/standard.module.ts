import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { PaginatorModule } from '../../tool/paginator/paginator.module';
import { ArkPipeModule } from '../../tool/pipe';
import { ShareModule } from '../../tool/share';

import { StandardSearchComponents } from './search/standard-search.component';
import { StandardDetailsComponents } from './details/standard-details.component';
import { DataNotFoundModule } from '../data-not-found';

import { HeaderModule } from '../header';
import { HeaderSearchModule } from '../header-search';
import { FooterModule } from '../footer';
import { AddCollectModule } from '../add-collect';
import { StandardRoutes } from './standard.routes';
import { StandardService } from './standard.service';
import { StandardDetailService } from './service/standard-details.service';
import { StandardServer } from './service/standard.service';

@NgModule({
  declarations: [
    StandardSearchComponents,
    StandardDetailsComponents
  ],
  imports: [
    HeaderModule,
    HeaderSearchModule,
    FooterModule,
    CommonModule,
    FormsModule,
    PaginatorModule,
    ArkPipeModule,
    ShareModule,
    DataNotFoundModule,
    AddCollectModule,
    RouterModule.forChild(StandardRoutes)
  ],
  providers: [
    StandardService,
    StandardServer,
    StandardDetailService
  ]
})
export class StandardModule { }
