import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import {
  MatButtonModule,
  MatSidenavModule,
  MatCardModule,
} from '@angular/material';

import { HeaderModule } from '../header';
import { FooterModule } from '../footer';

import { AuthGuard } from './auth-guard.service';

import { ManageRoutingModule } from './manage-routing.module';
import { ManageService } from './manage.service';
import { ManageComponent } from './manage.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatSidenavModule,
    MatCardModule,
    HeaderModule,
    FooterModule,
    ManageRoutingModule
  ],
  declarations: [
    ManageComponent,
  ],
  providers: [
    AuthGuard,
    ManageService
  ]
})

export class ManageModule {}
