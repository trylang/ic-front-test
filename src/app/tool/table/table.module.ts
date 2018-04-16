import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; // <--- JavaScript import from Angular
import {CommonModule} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { PaginatorModule } from '../paginator';
import { TableComponent } from './table.component';
import { ArkDirectiveModule } from '../directive';


@NgModule({
  imports: [
    FormsModule,  // <--- import into the NgModule
    CommonModule,
    NgbModule.forRoot(),
    PaginatorModule,
    ArkDirectiveModule
  ],
  exports: [TableComponent],
  declarations: [TableComponent]
})
export class TableModule { }
