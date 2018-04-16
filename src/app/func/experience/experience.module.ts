import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ArkPipeModule } from '../../tool/pipe';
import { ExperienceComponent } from './experience.component';
import { HeaderModule } from '../header';

const ROUTES: Routes = [
  { path: '', component : ExperienceComponent}
];


@NgModule({
  declarations: [
    ExperienceComponent,
  ],
  imports: [
    CommonModule,
    ArkPipeModule,
    HeaderModule,
    RouterModule.forChild(ROUTES),
  ]
})
export class ExperienceModule { }
