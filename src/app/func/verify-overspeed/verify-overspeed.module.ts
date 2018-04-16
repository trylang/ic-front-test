import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { HeaderModule } from '../header';
import { FooterModule } from '../footer';

import { VerifyOverspeedComponent } from './verify-overspeed.component';

const ROUTERS: Routes = [{ path: '', component: VerifyOverspeedComponent }];

@NgModule({
  declarations: [VerifyOverspeedComponent],
  imports: [CommonModule, FormsModule, HeaderModule, FooterModule, RouterModule.forChild(ROUTERS)],
  exports: [],
  providers: []
})
export class VerifyOverspeedModule {}
