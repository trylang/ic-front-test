import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Routes, RouterModule} from '@angular/router';
import { HeaderModule } from '../header';
import { FooterModule } from '../footer';

import { LogInComponent } from './log-in.component';

export const ROUTES: Routes = [
  {path: '', component: LogInComponent}
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HeaderModule,
    FooterModule,
    RouterModule.forChild(ROUTES)
  ],
  declarations: [
    LogInComponent
  ]
})
export class LogInModule {}
