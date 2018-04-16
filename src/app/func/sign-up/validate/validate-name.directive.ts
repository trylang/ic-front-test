import { Directive, Input, SimpleChange, OnChanges } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, ValidatorFn, Validators } from '@angular/forms';

export function nameValidator(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => {
    const nameReg = /^[\w\u4e00-\u9fa5]+$/g; // 只支持中文英文数字下划线
    const falseNameReg = /^\d+$/g; // 不支持纯数字
    const isFalse = control.value && (!nameReg.test(control.value) || falseNameReg.test(control.value));

    return isFalse ? {invalidateName: control.value} : null;
  };
}

@Directive({
  selector: '[invalidateName]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: NameValidatorDirective,
    multi: true
  }]
})
export class NameValidatorDirective implements Validator {
  @Input() private name: string;
  public validate(control: AbstractControl): {[key: string]: any} {
    return this.name ? nameValidator()(control) : null;
  }
}
