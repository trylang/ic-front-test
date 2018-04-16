import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartDirective } from './chart';

@NgModule({
  declarations: [
    ChartDirective
  ],
  imports: [ CommonModule ],
  exports: [
    ChartDirective
  ],
  providers: [],
})
export class ChartModule {}
