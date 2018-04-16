import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { HeaderACcountModule } from '../header-account';
import { HeaderComponent } from './header.component';

@NgModule({
  declarations: [
    HeaderComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    HeaderACcountModule
  ],
  exports: [
    HeaderComponent
  ],
  providers: [],
})
export class HeaderModule {}
