import { Directive, Input, SimpleChange, OnChanges } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, ValidatorFn, Validators } from '@angular/forms';

export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => {
    const passwordReg = /^[\w%@^\s]+$/; // 仅支持数字，字母_%@
    const isFalse = control.value && !passwordReg.test(control.value);

    return isFalse ? {arkValidatePassword: control.value} : null;
  };
}

@Directive({
  selector: '[arkValidatePassword]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: PasswordValidatorDirective,
    multi: true
  }]
})
export class PasswordValidatorDirective implements Validator {
  @Input() private password: string;
  public validate(control: AbstractControl): {[key: string]: any} {
    return this.password ? passwordValidator()(control) : null;
  }
}
