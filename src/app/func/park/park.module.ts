import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Routes, RouterModule } from '@angular/router';
import { ArkPipeModule } from '../../tool/pipe';
import { PaginatorModule } from '../../tool/paginator/paginator.module';
import { HeaderModule } from '../header';
import { HeaderSearchModule } from '../header-search';
import { FooterModule } from '../footer';
import { HeaderACcountModule } from '../header-account';
import { ShareModule } from '../../tool/share';
import { ParkListComponent } from './park-search/park-search.component';
import { ParkDetailComponent } from './park-detail/park-detail.component';
import { JsonpModule } from '@angular/http';
import { ArkDirectiveModule } from '../../tool/directive';
import { ParkService } from './service/park.service';
import { ParkRoutes } from './park.routes';
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
    JsonpModule,
    HeaderACcountModule,
    RouterModule.forChild(ParkRoutes),
    DataNotFoundModule,
    ArkDirectiveModule,
    AddCollectModule
  ],
  declarations: [ParkListComponent, ParkDetailComponent],
  providers: [ParkService],
  exports: []
})
export class ParkModule {}
