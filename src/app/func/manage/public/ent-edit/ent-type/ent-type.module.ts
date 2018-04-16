import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatCheckboxModule } from '@angular/material';

import { EntTypeComponent } from './ent-type.component';

@NgModule({
  declarations: [
    EntTypeComponent
  ],
  imports: [ CommonModule, FormsModule, MatDialogModule, MatCheckboxModule ],
  exports: [
    EntTypeComponent
  ],
  entryComponents: [
    EntTypeComponent
  ],
  providers: [],
})
export class EntTypeModule {}
