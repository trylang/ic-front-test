import { Component, Inject, Input, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { SnackBar } from '../../../tool/snackbar';

import { PasswordService } from './password.service';
import { Account } from '../../../account.model';
import { passwordValidator } from '../../../tool/validator';
import { Password } from '../model/password.model';
import * as _ from 'lodash';

@Component({
  moduleId: 'dialog',
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss'],
  providers: [BsModalService, PasswordService]
})
export class PasswordComponent implements OnInit {
  public modalRef: BsModalRef;
  public account: Account;
  public pass: Password = {
    oldPassword: null,
    newPassword: null,
    confirmPassword: null
  };

  public passForm: FormGroup;

  public formErrors = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
    passwordsGroup: {
      newPassword: '',
      confirmPassword: '',
    }
  };

  public validationMessages = {
    oldPassword: {
      required: '请输入密码',
      minlength: '密码至少6个字符',
      maxlength: '密码至多16个字符',
      invalidatePassword: '密码格式不正确, 仅支持字母、数字和字符_、%、@'
    },
    newPassword: {
      required: '请输入密码',
      minlength: '密码至少6个字符',
      maxlength: '密码至多16个字符',
      invalidatePassword: '密码格式不正确, 仅支持字母、数字和字符_、%、@'
    },
    confirmPassword: {
      required: '请输入确认密码',
      minlength: '密码至少6个字符',
      maxlength: '密码至多16个字符',
      invalidatePassword: '密码格式不正确, 仅支持字母、数字和字符_、%、@'
    },
    passwordsGroup : {
      required: '请输入密码',
      minlength: '密码至少6个字符',
      maxlength: '密码至多16个字符',
      invalidatePassword: '密码格式不正确, 仅支持字母、数字和字符_、%、@',
      equal: '与新密码不一致',
      Equal: '新密码不能与与密码相同'
    }
  };

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private route: ActivatedRoute,
    private passwordService: PasswordService,
    private snackbar: SnackBar
  ) {}

  public ngOnInit() {
    this.buildPassForm();
  }

  public onCancel(): void {
    this.dialogRef.close();
  }

  public filterSpace(e: any): boolean {
    let keycode;
    if (window.event) {
      keycode = e.keyCode;
    } else if (e.which) {
      keycode = e.which;
    }
    if (keycode === 32) {
      return false;
    }
    return true;
  }

  public onChangePwdSubmit(): void {
    this.passwordService.changePWD(this.pass.oldPassword, this.pass.newPassword).subscribe((data: any) => {
      if ('2000' === data.code) {
        _.delay(() => {
         this.snackbar.success('密码已修改成功');
         this.logout();
        }, 1000);
       } else {
         this.snackbar.warning(data.message);
       }
    });
    this.dialogRef.close();
  }


  /**
   * 密码修改后要重新登陆获取验证信息
   */
  public logout() {
    this.passwordService.logout().subscribe((data: any) => {
      if ('2000' === data.code) {
        localStorage.removeItem('account');
        this.account = new Account();
        this.router.navigate(['/login']);
      }
    });
  }

  private equalValidator(group: FormGroup): any {
    const newPassword: FormControl = group.get('newPassword') as FormControl;
    const oldPassword: FormControl = group.get('oldPassword') as FormControl;
    const confirmPassword: FormControl = group.get('confirmPassword') as FormControl;
    const valid: boolean = newPassword && confirmPassword && (newPassword.value === confirmPassword.value);
    return valid ? null : (oldPassword.value === newPassword.value) ? {Equal: true} : {equal: true};
  }

  /**
   * 表单校验
   * @private
   * @memberof SettingComponent
   */
  private buildPassForm(): void {
    this.passForm = this.fb.group({
      passwordsGroup: this.fb.group({
        oldPassword: [
          this.pass.oldPassword,
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(16),
            passwordValidator()
          ]
        ],
        newPassword: [
          this.pass.newPassword,
           [
             Validators.required,
             Validators.minLength(6),
             Validators.maxLength(16),
             passwordValidator()
          ]
        ],
        confirmPassword: [
          this.pass.confirmPassword,
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(16),
            passwordValidator()
          ]
        ],
      },
      { validator: this.equalValidator })
    });
    this.passForm.valueChanges.subscribe((data: any) => this.onValueChanged(data));
  }

  private onValueChanged(data?: any) {
    if (!this.passForm) {
      return;
    }
    function filterError(that: any, errors: any, field: any, messages: any) {
      for (const key of Object.keys(errors)) {
        that.formErrors[field] = messages[key];
      }
    }
    const form = this.passForm;

    for (const field of Object.keys(this.formErrors)) {
      this.formErrors[field] = '';
      const control = form.get(field);

      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        if (control.errors) {
          filterError(this, control.errors, field, messages);
        }
      }
      // 获取组合信息
      const passwordsGroup = form.get('passwordsGroup');
      if (passwordsGroup) {
        const newPasswordValid =  passwordsGroup.get('newPassword');
        const confirmPasswordValid =  passwordsGroup.get('confirmPassword');
        if (newPasswordValid && newPasswordValid.dirty && !newPasswordValid.valid) {
          const messages = this.validationMessages['newPassword'];
          filterError(this, newPasswordValid.errors, 'newPassword', messages);
        }
        if (confirmPasswordValid && confirmPasswordValid.dirty && !confirmPasswordValid.valid) {
          const messages = this.validationMessages['confirmPassword'];
          filterError(this, confirmPasswordValid.errors, 'confirmPassword', messages);
        }
      }
    }
  }
}
