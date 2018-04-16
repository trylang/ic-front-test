import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './footer.component';
import { ArkDirectiveModule } from '../../tool/directive';

@NgModule({
  declarations: [
    FooterComponent
  ],
  imports: [
    RouterModule,
    ArkDirectiveModule
  ],
  exports: [
    FooterComponent
  ]
})
export class FooterModule {}
