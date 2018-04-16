import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Routes, RouterModule } from '@angular/router';
import { ArkPipeModule } from '../../tool/pipe';
import { PaginatorModule } from '../../tool/paginator/paginator.module';
import { HeaderModule } from '../header';
import { HeaderSearchModule } from '../header-search';
import { FooterModule } from '../footer';
import { ShareModule } from '../../tool/share';

import { CompanySearchComponent } from './company-search/company-search.component';
import { CompanyDetailComponent } from './company-detail/company-detail.component';
import { CompanyService } from './service/company.service';
import { CompanyRoutes } from './company.routes';
import { DataNotFoundModule } from '../data-not-found';
import { AddCollectModule } from '../add-collect';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PaginatorModule,
    ArkPipeModule,
    HeaderModule,
    HeaderSearchModule,
    FooterModule,
    ShareModule,
    RouterModule.forChild(CompanyRoutes),
    DataNotFoundModule,
    AddCollectModule
  ],
  declarations: [CompanySearchComponent, CompanyDetailComponent],
  providers: [CompanyService],
  exports: []
})
export class CompanyModule {}
