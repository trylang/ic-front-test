import { Directive, Input, SimpleChange, OnChanges } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, ValidatorFn, Validators } from '@angular/forms';

export function telValidator(customReg?: RegExp): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => {
    const telReg = /^[-+0-9]{0,15}$/; // 默认校验固话，仅支持15位
    const isFalse = control.value && (customReg ? !customReg.test(control.value) : !telReg.test(control.value));

    return isFalse ? {arkValidateTel: control.value} : null;
  };
}

@Directive({
  selector: '[arkValidateTel]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: TelValidatorDirective,
    multi: true
  }]
})
export class TelValidatorDirective implements Validator {
  @Input() private validateTel: RegExp;
  public validate(control: AbstractControl): {[key: string]: any} {
    return this.validateTel ? telValidator(this.validateTel)(control) : null;
  }
}
