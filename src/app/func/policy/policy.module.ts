import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ShareModule } from '../../tool/share';

import { PolicySearchComponents } from './search/policy-search.component';
import { PolicyDetailsComponents } from './details/policy-details.component';

import { AddCollectModule } from '../add-collect';
import { PaginatorModule } from '../../tool/paginator/paginator.module';
import { ArkPipeModule } from '../../tool/pipe';
import { DataNotFoundModule } from '../data-not-found';

import { HeaderModule } from '../header';
import { HeaderSearchModule } from '../header-search';
import { FooterModule } from '../footer';
import { PolicyRoutes } from './policy.routes';
import { PolicyDetailService } from './service/policy-details.service';
import { PolicyServer } from './service/policy.service';

@NgModule({
  declarations: [
    PolicySearchComponents,
    PolicyDetailsComponents
  ],
  imports: [
    HeaderModule,
    HeaderSearchModule,
    FooterModule,
    CommonModule,
    FormsModule,
    ArkPipeModule,
    PaginatorModule,
    ShareModule,
    DataNotFoundModule,
    AddCollectModule,
    RouterModule.forChild(PolicyRoutes)
  ],
  providers: [
    PolicyDetailService,
    PolicyServer
  ]
})
export class PolicyModule { }
