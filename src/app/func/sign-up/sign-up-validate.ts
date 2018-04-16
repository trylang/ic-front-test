import { Directive, Input, SimpleChange, OnChanges } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, ValidatorFn, Validators, AsyncValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { AppService } from '../../app.service';

export function serverNameValidator(appService: AppService): AsyncValidatorFn {
  return (control: AbstractControl): Promise<{ [key: string]: any }> => {
    const method = '/account/isExistName';
    if (control.value) {
      return new Promise((resolve: any) => {
        appService.GET(method, { username: control.value }).subscribe((data: any) => {
          if ('2000' === data.code) {
            resolve({ invalidateServerName: control.value });
            // resolve(null);
          }
        });
      });
    } else {
      return new Promise((resolve: any) => resolve(null));
    }
  };
}

export function serverNameValidator2(appService: AppService): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    return { invalidateServerName: control.value };
  };
}
