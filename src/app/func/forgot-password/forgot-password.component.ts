import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, Params, NavigationExtras  } from '@angular/router';
import { AppService } from '../../app.service';
import * as _ from 'lodash';
import { SnackBar } from '../../tool/snackbar';

import { phoneValidator, emailValidator, passwordValidator } from '../../tool/validator';
import { ForgotPsdService } from './forgot-password.service';
import { PersionPsdForm, SendEmailForm, EntPsdForm, FormError } from './model';

@Component({
  selector: 'forgot-psd',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  providers: [ForgotPsdService]
})
export class ForgotPsdComponent implements OnInit {

  public PersionPsdForm: FormGroup;
  public SendEmailForm: FormGroup;
  public EntPsdForm: FormGroup;

  // 个人用户
  public account: PersionPsdForm = {
    phone: null,
    kaptcha: null,
    password: null,
    confirmpsd: null,
    authCode: null
  };

  // 企业用户发送邮件
  public sendEmail: SendEmailForm = {
    email: null,
    kaptcha: null
  };

  // 企业用户修改秘密
  public entPsd: EntPsdForm = {
    key: null,
    password: null,
    confirmpsd: null
  };

  public formErrors: FormError = {
    email: '',
    phone: '',
    password: '',
    confirmpsd: '',
    passwordsGroup: {
      password: '',
      confirmpsd: ''
    }
  };

  public validationMessages = {
    phone: {
      required: '请输入手机号',
      arkValidatePhone: '手机号格式不正确'
    },
    email: {
      required: '请输入邮箱',
      arkValidateEmail: '请输入有效的邮箱'
    },
    password: {
      required: '请输入密码',
      minlength: '密码至少6个字符',
      maxlength: '密码至多16个字符',
      invalidatePassword: '密码格式不正确, 仅支持字母、数字和字符_、%、@'
    },
    confirmpsd: {
      required: '请输入确认密码',
    },
    authCode: {
      required: '请输入激活码',
      invalidateCode: '激活码格式不正确'
    },
    passwordsGroup : {
      required: '请输入密码',
      minlength: '密码至少6个字符',
      maxlength: '密码至多16个字符',
      invalidatePassword: '密码格式不正确, 仅支持字母、数字和字符_、%、@',
      equal: '与新密码不一致'
    }
  };

  public showPersonForm: boolean = false;
  public showEntForm: boolean = false;
  public canGetCode: boolean = true;
  public codeMessage: string = '获取激活码';
  public kaptchaImg: string;

  constructor(
    private titleService: Title,
    private forgotpsdService: ForgotPsdService,
    private fb: FormBuilder,
    private snackbar: SnackBar,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private appService: AppService
  ) {
    const title = this.titleService.getTitle();
    this.titleService.setTitle('登录' + title.match(/(\s+-\s+[\u4e00-\u9fa5]+)$/)[0]);
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      if (params.type === 'person') {
        this.showPersonForm = true;
      } else if (params.type === 'ent') {
        this.showPersonForm = false;
      } else if (params.type === 'resetpassword') {
        this.showPersonForm = true;
        this.showEntForm = true;
        this.entPsd.key = params.uuid;
      }
    });
  }

  public ngOnInit() {
    this.buildForm();
    this.getKaptcha();
  }

  // 个人用户修改密码
  public onPersonSubmit(): void {

    this.forgotpsdService.messageResetPassword(this.account).subscribe((data: any) => {
      if ('2000' === data.code) {

        this.snackbar.success('密码修改成功，正在跳转到登录页面');

        _.delay(() => {
          this.router.navigate(['/login']);
        }, 500);
      }
    });
  }

  // 发送邮件
  public onSendEmail(): void {
    this.forgotpsdService.sendResetPasswordEmail(this.sendEmail).subscribe((data: any) => {
      if ('2000' === data.code) {
        this.snackbar.success('邮件已发送，请注意查收');
      }
    });
  }

  // 修改企业密码
  public onEntSubmit(): void {
    this.forgotpsdService.emailResetPassword(this.entPsd).subscribe((data: any) => {
      if ('2000' === data.code) {
          this.snackbar.success('密码修改成功，正在跳转到登录页面');

          _.delay(() => {
            this.router.navigate(['/login']);
          }, 500);
        }
    });
  }

  // 发送手机短信验证码
  public getResetPwdAuthCode(phone: string) {
    if (!this.account.phone) {
      this.snackbar.warning('请输入手机号');
      return;
    }
    this.forgotpsdService.getResetPwdAuthCode(phone).subscribe((data: any) => {
      if (data.code === '2000') {
        this.snackbar.success('验证码已发送，请注意查收');
        this.canGetCode = false;
        let seconds = 60;
        const interval = setInterval(() => {
          seconds--;
          this.codeMessage = `再次获取（${seconds} s）`;
          if (seconds <= 0) {
            clearInterval(interval);
            this.canGetCode = true;
            this.codeMessage = '获取验证码';
          }
        }, 1000);
      }
    });
  }

  // 获取验证码
  private getKaptcha() {
    this.forgotpsdService.getKaptcha().subscribe((data: any) => {
      if (data.code === '2000') {
        this.kaptchaImg = `data:image/jpg;base64,${data.data}`;
      }
    });
  }

  private confirmPsdValidator(group: FormGroup): any {
    const password: FormControl = group.get('password') as FormControl;
    const confirmpsd: FormControl = group.get('confirmpsd') as FormControl;
    const valid: boolean = (password.value === confirmpsd.value);
    return valid ? null : {equal: true};
  }

  private buildForm(): void {

    // 个人手机号修改密码
    this.PersionPsdForm = this.fb.group({
      phone: [this.account.phone, [Validators.required, phoneValidator()]],
      kaptcha: [this.account.kaptcha, [Validators.required]],
      authCode: [this.account.authCode, [Validators.required]],
      passwordsGroup: this.fb.group({
        password: [this.account.password, [Validators.required, Validators.minLength(6), Validators.maxLength(16), passwordValidator()]],
        confirmpsd: [this.account.confirmpsd, [Validators.required]]
      }, {validator: this.confirmPsdValidator})
    });
    this.PersionPsdForm.valueChanges.subscribe((data: any) => this.onValueChanged(this.PersionPsdForm, data));

    // 企业发送邮件
    this.SendEmailForm = this.fb.group({
      email: [this.account.phone, [Validators.required, emailValidator()]],
      kaptcha: [this.account.kaptcha, [Validators.required]],
    });
    this.SendEmailForm.valueChanges.subscribe((data: any) => this.onValueChanged(this.SendEmailForm, data));

    // 企业修改密码
    this.EntPsdForm = this.fb.group({
      passwordsGroup: this.fb.group({
        password: [this.account.password, [Validators.required, Validators.minLength(6), Validators.maxLength(16), passwordValidator()]],
        confirmpsd: [this.account.confirmpsd, [Validators.required]]
      }, {validator: this.confirmPsdValidator})
    });
    this.EntPsdForm.valueChanges.subscribe((data: any) => this.onValueChanged(this.EntPsdForm, data));
  }

  private onValueChanged(formdata: any, data?: any) {
    if (!formdata) {
      return;
    }
    function filterError(that: any, errors: any, field: any, messages: any) {
      for (const key of Object.keys(errors)) {
        that.formErrors[field] = messages[key];
      }
    }

    const form = formdata;

    for (const field of Object.keys(this.formErrors)) {
      // clear previous error message (if any)
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
        const passwordValid =  passwordsGroup.get('password');
        const confirmpsdValid =  passwordsGroup.get('confirmpsd');
        if (passwordValid && passwordValid.dirty && !passwordValid.valid) {
          const messages = this.validationMessages['password'];
          filterError(this, passwordValid.errors, 'password', messages);
        }
        if (confirmpsdValid && confirmpsdValid.dirty && !confirmpsdValid.valid) {
          const messages = this.validationMessages['confirmpsd'];
          filterError(this, confirmpsdValid.errors, 'confirmpsd', messages);
        }
      }
    }
  }
}
