import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatDialogModule } from '@angular/material';

import { ValidatorModule } from '../../../tool/validator';
import { PasswordComponent } from './password.component';

@NgModule({
  declarations: [
    PasswordComponent
  ],
  imports: [ CommonModule, FormsModule, ReactiveFormsModule, MatDialogModule ],
  exports: [
    PasswordComponent
  ],
  providers: [],
  entryComponents: [
    PasswordComponent
  ]
})
export class PasswordModule {}
