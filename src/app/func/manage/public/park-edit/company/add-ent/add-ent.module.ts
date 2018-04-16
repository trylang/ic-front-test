import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule, MatDialogModule } from '@angular/material';

import { AddEntComponent} from './add-ent.component';

@NgModule({
  declarations: [
    AddEntComponent
  ],
  imports: [ CommonModule, FormsModule, MatButtonModule, MatDialogModule ],
  exports: [
    AddEntComponent
  ],
  providers: [],
  entryComponents: [
    AddEntComponent
  ]
})
export class AddEntModule {}
