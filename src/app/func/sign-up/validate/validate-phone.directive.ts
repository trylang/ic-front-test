import { Directive, Input, SimpleChange, OnChanges } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, ValidatorFn, Validators } from '@angular/forms';

export function phoneValidator(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => {
    const phoneReg = /^1[34578][0-9]{9}$/g; // 仅支持11位手机号，13*,14*,15*,17*,18*
    const isFalse = control.value && !phoneReg.test(control.value);

    return isFalse ? {invalidatePhone: control.value} : null;
  };
}

@Directive({
  selector: '[invalidatePhone]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: PhoneValidatorDirective,
    multi: true
  }]
})
export class PhoneValidatorDirective implements Validator {
  @Input() private phone: string;
  public validate(control: AbstractControl): {[key: string]: any} {
    return this.phone ? phoneValidator()(control) : null;
  }
}
