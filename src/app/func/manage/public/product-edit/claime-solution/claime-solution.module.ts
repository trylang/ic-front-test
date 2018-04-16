import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatButtonModule, MatInputModule, MatIconModule } from '@angular/material';
import { PaginatorModule } from '../../../../../tool/paginator';
import { ArkPipeModule } from '../../../../../tool/pipe';
import { ClaimeSolutionComponent } from './claime-solution.component';

@NgModule({
  declarations: [
    ClaimeSolutionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    PaginatorModule,
    ArkPipeModule
  ],
  exports: [
    ClaimeSolutionComponent
  ],
  entryComponents: [
    ClaimeSolutionComponent
  ]
})
export class ClaimeSolutionModule {}
