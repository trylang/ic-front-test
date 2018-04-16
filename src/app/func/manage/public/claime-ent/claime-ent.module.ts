import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatButtonModule, MatInputModule, MatIconModule } from '@angular/material';
import { PaginatorModule } from '../../../../tool/paginator';

import { ClaimeEntComponent } from './claime-ent.component';

@NgModule({
  declarations: [
    ClaimeEntComponent
  ],
  imports: [ CommonModule, FormsModule, MatDialogModule, MatButtonModule, MatInputModule, MatIconModule, PaginatorModule ],
  exports: [
    ClaimeEntComponent
  ],
  entryComponents: [
    ClaimeEntComponent
  ]
})
export class ClaimeEntModule {}
