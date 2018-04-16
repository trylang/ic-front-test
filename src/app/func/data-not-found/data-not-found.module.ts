import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataNotFoundComponent } from './data-not-found.component';

@NgModule({
  declarations: [
    DataNotFoundComponent
  ],
  imports: [ CommonModule ],
  exports: [
    DataNotFoundComponent
  ],
  providers: [],
})
export class DataNotFoundModule {}
