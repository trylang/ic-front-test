import { Directive, Input, SimpleChange, OnChanges } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, ValidatorFn, Validators } from '@angular/forms';

export function codeValidator(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => {
    const codeReg = /^[\d]{6}$/g; // 只可以是6位数字
    const isFalse = control.value && !codeReg.test(control.value);

    return isFalse ? {invalidateCode: control.value} : null;
  };
}

@Directive({
  selector: '[invalidateCode]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: CodeValidatorDirective,
    multi: true
  }]
})
export class CodeValidatorDirective implements Validator {
  @Input() private code: number;
  public validate(control: AbstractControl): {[key: string]: any} {
    return this.code ? codeValidator()(control) : null;
  }
}
