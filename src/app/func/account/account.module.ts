import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxCropperModule } from 'ngx-cropper';
import { Routes, RouterModule } from '@angular/router';
import { MatDialogModule, MatCardModule, MatButtonModule, MatIconModule, MatCheckboxModule } from '@angular/material';
import { HeaderModule } from '../header';
import { FooterModule } from '../footer';

import { PaginatorModule } from '../../tool/paginator';
import { ArkPipeModule } from '../../tool/pipe';
import { TableModule } from '../../tool/table/table.module';
import { PasswordModule } from './password/password.module';
import { HomeModule } from './home/home.module';
import { EntTypeModule } from '../manage/public/ent-edit/ent-type';
import { AuthGuard } from './auth-guard.service';
import { AccountComponent } from './account.component';
import { EmailComponent } from './email/email.component';
import { SettingComponent } from './setting/setting.component';

import { CollectComponent } from './collect/collect.component';

import { AccountService } from './account.service';
const ROUTES: Routes = [
  {
    path: '',
    component: AccountComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'product/edit',
        loadChildren: '../manage/public/product-edit/product-edit.module#ProductEditModule',
        data: { animation: 'product' },
        canActivateChild: [AuthGuard]
      },
      {
        path: 'scheme/edit',
        loadChildren: '../manage/public/solution-edit/solution-edit.module#SolutionEditModule',
        data: { animation: 'solution' },
        canActivateChild: [AuthGuard]
      },
      {
        path: 'case/edit',
        loadChildren: '../manage/public/case-edit/case-edit.module#CaseEditModule',
        data: { aimation: 'case' },
        canActivateChild: [AuthGuard]
      },
      { path: 'ent', loadChildren: './ent-user/ent-user.module#EntUserModule' },
      { path: 'park', loadChildren: './park-user/park-user.module#ParkUserModule' },
      { path: 'person', loadChildren: './person-user/person-user.module#PersonUserModule', canActivateChild: [AuthGuard] },
      { path: 'email', component: EmailComponent },
      { path: 'setting', component: SettingComponent },
      { path: 'home', loadChildren: './home/home.module#HomeModule', canActivateChild: [AuthGuard] },
      { path: 'collect', component: CollectComponent, canActivateChild: [AuthGuard] }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgxCropperModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    HeaderModule,
    FooterModule,
    ArkPipeModule,
    PaginatorModule,
    TableModule,
    PasswordModule,
    EntTypeModule,
    HomeModule,
    RouterModule.forChild(ROUTES)
  ],
  declarations: [AccountComponent, EmailComponent, SettingComponent, CollectComponent],
  providers: [AccountService, AuthGuard]
})
export class AccountModule {}
