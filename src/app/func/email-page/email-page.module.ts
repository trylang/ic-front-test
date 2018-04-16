import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HeaderModule } from '../header';
import { FooterModule } from '../footer';

import { EmailPageComponent } from './emial-page.component';

const ROUTES: Routes = [{ path: '', component: EmailPageComponent }];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(ROUTES), HeaderModule, FooterModule],
  declarations: [EmailPageComponent]
})
export class EmailPageModule {}
