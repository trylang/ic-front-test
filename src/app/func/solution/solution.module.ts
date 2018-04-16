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

import { SolutionService } from './service/solution.service';

import { SolutionSearchComponent } from './solution-search/solution-search.component';
import { SolutionDetailComponent } from './solution-detail/solution-detail.component';
import { SolutionCaseComponent } from './solution-case/solution-case.component';

import { SolutionRoutes } from './solution.routes';
import { DataNotFoundModule } from '../data-not-found';
import { AddCollectModule } from '../add-collect';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PaginatorModule,
    ArkPipeModule,
    HeaderModule,
    FooterModule,
    ShareModule,
    HeaderSearchModule,
    RouterModule.forChild(SolutionRoutes),
    DataNotFoundModule,
    AddCollectModule
  ],
  declarations: [
    SolutionSearchComponent,
    SolutionDetailComponent,
    SolutionCaseComponent,
  ],
  providers: [
    SolutionService
  ],
   exports: []
})

export class SolutionModule { }
