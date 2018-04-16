import { Directive, Input, SimpleChange, OnChanges } from '@angular/core';
import { Validator, ValidatorFn, Validators, AbstractControl, NG_VALIDATORS } from '@angular/forms';

export function nameValidator(customReg: RegExp | RegExp[]): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => {
    // 默认校验
    const nameReg = /^[\w\u4e00-\u9fa5]+$/g; // 只支持中文英文数字下划线
    const falseNameReg = /^\d+$/g; // 不支持纯数字
    let isFalse: boolean = false;

    if (!customReg) { // 默认校验
      isFalse = control.value && (!nameReg.test(control.value) || falseNameReg.test(control.value));
    } else { // 自定义校验规则
      if (Object.prototype.toString.call(customReg) === '[object RegExp]') {
       isFalse = control.value && !(customReg as RegExp).test(control.value);
      } else if (Object.prototype.toString.call(customReg) === '[object Array]') {
        const regs: RegExp[] = (customReg as RegExp[]).filter((reg: RegExp) => {
          return Object.prototype.toString.call(reg) === '[object RegExp]';
        });

        for (const reg of regs) {
          if (!reg.test(control.value)) {
            isFalse = true;
            return;
          }
        }
      }
    }

    return isFalse ? {arkValidateName: control.value} : null;
  };
}

@Directive({
  selector: '[arkValidateName]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: NameValidatorDirective,
    multi: true
  }]
})
export class NameValidatorDirective implements Validator {
  @Input() private validateName: RegExp | RegExp[];
  public validate(control: AbstractControl) {
    return this.validateName ? nameValidator(this.validateName)(control) : null;
  }
}

