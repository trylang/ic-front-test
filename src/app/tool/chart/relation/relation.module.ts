import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RelationComponent } from './relation.component';

@NgModule({
  declarations: [
    RelationComponent
  ],
  imports: [ CommonModule ],
  exports: [
    RelationComponent
  ],
  providers: [],
})
export class RelationModule {}
