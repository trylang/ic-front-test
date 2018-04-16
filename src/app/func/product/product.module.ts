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

import { ProductSearchComponent } from './product-search/product-search.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';

import { ProductService } from './service/product.service';
import { ProductRoutes } from './product.routes';
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
    RouterModule.forChild(ProductRoutes),
    DataNotFoundModule,
    AddCollectModule,
    HeaderSearchModule
  ],
  declarations: [ProductSearchComponent, ProductDetailComponent],
  providers: [ProductService],
  exports: []
})
export class ProductModule {}
