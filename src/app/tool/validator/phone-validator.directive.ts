import { Directive, Input, SimpleChange, OnChanges } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, ValidatorFn, Validators } from '@angular/forms';

export function phoneValidator(customReg?: RegExp): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => {
    const phoneReg = /^1[34578][0-9]{9}$/g; // 默认校验中国大陆手机号，仅支持11位手机号，13*,14*,15*,17*,18*
    const isFalse = control.value && (customReg ? !customReg.test(control.value) : !phoneReg.test(control.value));

    return isFalse ? {arkValidatePhone: control.value} : null;
  };
}

@Directive({
  selector: '[arkValidatePhone]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: PhoneValidatorDirective,
    multi: true
  }]
})
export class PhoneValidatorDirective implements Validator {
  @Input() private validatePhone: RegExp;
  public validate(control: AbstractControl): {[key: string]: any} {
    return this.validatePhone ? phoneValidator(this.validatePhone)(control) : null;
  }
}
