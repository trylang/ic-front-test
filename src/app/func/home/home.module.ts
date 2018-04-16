import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HeaderACcountModule } from '../header-account';

import { HomeComponent } from './home.component';

export const ROUTES: Routes = [
  {path: '', component: HomeComponent }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HeaderACcountModule,
    RouterModule.forChild(ROUTES)
  ],
  declarations: [
    HomeComponent
  ]
})

export class HomeModule {}
