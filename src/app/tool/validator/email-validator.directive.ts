import { Directive, Input, SimpleChange, OnChanges } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, ValidatorFn, Validators } from '@angular/forms';

export function emailValidator(customReg?: RegExp): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => {
    const emailReg = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/g;
    const isFalse = control.value && (customReg ? !customReg.test(control.value) : !emailReg.test(control.value));

    return isFalse ? {arkValidateEmail: control.value} : null;
  };
}

@Directive({
  selector: '[arkValidateEmail]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: EmailValidatorDirective,
    multi: true
  }]
})
export class EmailValidatorDirective implements Validator {
  @Input() private validateEmail: RegExp;
  public validate(control: AbstractControl): {[key: string]: any} {
    return this.validateEmail ? emailValidator(this.validateEmail)(control) : null;
  }
}
