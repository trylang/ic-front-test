import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatDialogModule, MatButtonModule } from '@angular/material';

import { NgxCropperModule } from 'ngx-cropper';
import { ArkPipeModule } from '../../../../../../tool/pipe';
import { AddPropertyComponent } from './add-property.component';

@NgModule({
  declarations: [
    AddPropertyComponent
  ],
  imports: [ CommonModule, FormsModule, NgxCropperModule, MatDialogModule, MatButtonModule, ArkPipeModule ],
  exports: [
    AddPropertyComponent
  ],
  providers: [],
  entryComponents: [
    AddPropertyComponent
  ]
})
export class AddPropertyModule {}
