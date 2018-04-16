import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule, MatDialogModule } from '@angular/material';
import { NgxCropperModule } from 'ngx-cropper';

import { ArkPipeModule } from '../../../../../../tool/pipe';
import { AddBrandComponent  } from './add-brand.component';

@NgModule({
  declarations: [
    AddBrandComponent
  ],
  imports: [ CommonModule, FormsModule, MatButtonModule, MatDialogModule, ArkPipeModule, NgxCropperModule ],
  exports: [
    AddBrandComponent
  ],
  providers: [],
  entryComponents: [
    AddBrandComponent
  ]
})
export class AddBrandModule {}
