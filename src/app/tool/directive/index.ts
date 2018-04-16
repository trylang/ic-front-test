import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ToggleActionDirective } from './toggle-action.directive';
import { MoreBtnDirective } from './more-btn.directive';
import { ScollToDirective } from './scroll-to.directive';

@NgModule({
  declarations: [
    ToggleActionDirective,
    MoreBtnDirective,
    ScollToDirective
  ],
  imports: [ CommonModule ],
  exports: [
    ToggleActionDirective,
    MoreBtnDirective,
    ScollToDirective
  ],
  providers: [],
})
export class ArkDirectiveModule {}
