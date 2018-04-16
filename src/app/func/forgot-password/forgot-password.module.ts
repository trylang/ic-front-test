import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule, MatButtonModule, MatInputModule, MatIconModule } from '@angular/material';
import { Routes, RouterModule} from '@angular/router';

import { ValidatorModule } from '../../tool/validator';
import { HeaderModule } from '../header';
import { FooterModule } from '../footer';
import { ForgotPsdComponent } from './forgot-password.component';

export const ROUTES: Routes = [
  {path: '', component: ForgotPsdComponent}
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ValidatorModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    HeaderModule,
    FooterModule,
    RouterModule.forChild(ROUTES)
  ],
  declarations: [
    ForgotPsdComponent,
  ]
})
export class ForgotPsdModule {}
