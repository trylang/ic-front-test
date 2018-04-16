import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HeaderSearchComponent } from './header-search.component';

@NgModule({
  declarations: [
    HeaderSearchComponent
  ],
  imports: [ CommonModule, FormsModule, RouterModule ],
  exports: [
    HeaderSearchComponent
  ],
  providers: [],
})
export class HeaderSearchModule {}
