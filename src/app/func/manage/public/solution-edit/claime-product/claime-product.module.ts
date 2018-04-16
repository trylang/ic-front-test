import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatButtonModule, MatInputModule, MatIconModule } from '@angular/material';
import { PaginatorModule } from '../../../../../tool/paginator';
import { ArkPipeModule } from '../../../../../tool/pipe';
import { ClaimeProductComponent } from './claime-product.component';

@NgModule({
  declarations: [
    ClaimeProductComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    PaginatorModule,
    ArkPipeModule
  ],
  exports: [
    ClaimeProductComponent
  ],
  entryComponents: [
    ClaimeProductComponent
  ]
})
export class ClaimeProductModule {}
