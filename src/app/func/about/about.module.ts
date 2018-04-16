import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ArkPipeModule } from '../../tool/pipe';
import { AboutComponent } from './about.component';
import { HeaderModule } from '../header';

const ROUTES: Routes = [
  { path: '', component : AboutComponent}
];


@NgModule({
  declarations: [
    AboutComponent,
  ],
  imports: [
    CommonModule,
    ArkPipeModule,
    HeaderModule,
    RouterModule.forChild(ROUTES),
  ]
})
export class AboutModule { }
