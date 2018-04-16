import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmailValidatorDirective } from './email-validator.directive';
import { NameValidatorDirective } from './name-validator.directive';
import { PhoneValidatorDirective } from './phone-validator.directive';
// import {} from './tel-validator.directive';
// import { } from './two-relation-validator.directive';
import { ValidatorService } from './validator.service';

@NgModule({
  declarations: [
    EmailValidatorDirective,
    NameValidatorDirective,
    PhoneValidatorDirective,
  ],
  imports: [ CommonModule ],
  exports: [
    EmailValidatorDirective,
    NameValidatorDirective,
    PhoneValidatorDirective,
  ],
  providers: [
    ValidatorService
  ],
})
export class ValidatorModule {}
