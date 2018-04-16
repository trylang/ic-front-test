import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HeaderModule } from '../header';
import { FooterModule } from '../footer';
import { MatCheckboxModule } from '@angular/material';
import { ValidatorModule } from '../../tool/validator';
import { ArkDirectiveModule } from '../../tool/directive';


import { SignUpComponent } from './sign-up.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';

export const ROUTES: Routes = [
  { path: 'verifyemail', component: VerifyEmailComponent },
  { path: '', component: SignUpComponent }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HeaderModule,
    FooterModule,
    MatCheckboxModule,
    ValidatorModule,
    ArkDirectiveModule,
    RouterModule.forChild(ROUTES)
  ],
  declarations: [
    SignUpComponent,
    VerifyEmailComponent
  ]
})
export class SignUpModule {}
