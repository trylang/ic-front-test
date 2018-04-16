import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { ChartModule } from '../../../../tool/chart';
import { ArkPipeModule } from '../../../../tool/pipe';

import { MacroComponent } from './main/macro.component';
import { MacroContentComponent } from './content/macro-content.component';

import { SidebarComponent } from './sidebar/sidebar.component';
import { TreeNodeComponent } from './sidebar/treenode.component';
import { SidebarService } from './sidebar/sidebar.service';

import { MacroServer } from './service/macro.service';
import { MacroHttpServer } from './service/macro-http.service';
import { PaginatorModule } from '../../../../tool/paginator';

const ROUTES: Routes = [
  { path: '', component: MacroComponent }
];

@NgModule({
  declarations: [
    MacroComponent,
    MacroContentComponent,
    SidebarComponent,
    TreeNodeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ChartModule,
    ArkPipeModule,
    PaginatorModule,
    RouterModule.forChild(ROUTES)
  ],
  providers: [
    MacroServer,
    MacroHttpServer,
    SidebarService
  ]
})
export class MacroModule { }
