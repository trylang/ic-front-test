import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ArkPipeModule } from '../../tool/pipe';

import { HeaderAccountComponent } from './header-account.component';

@NgModule({
  declarations: [
    HeaderAccountComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ArkPipeModule
   ],
  exports: [
    HeaderAccountComponent
  ],
  providers: [],
})
export class HeaderACcountModule {}
