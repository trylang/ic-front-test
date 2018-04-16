import { Routes, RouterModule } from '@angular/router';

import { ProductSearchComponent } from './product-search/product-search.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';

export const ProductRoutes = [
  { path: 'search', component: ProductSearchComponent },
  { path: 'detail', component: ProductDetailComponent }
];
