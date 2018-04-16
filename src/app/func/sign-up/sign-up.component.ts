import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { SnackBar } from '../../tool/snackbar';

import { nameValidator } from './validate/validate-name.directive';
import { passwordValidator } from './validate/validate-password.directive';
import { phoneValidator } from './validate/validate-phone.directive';
import { codeValidator } from './validate/validate-code.directive';

import { SignUpService } from './sign-up.service';
import { SignUp, EntSignUp } from './model';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  providers: [SignUpService]
})
export class SignUpComponent implements OnInit {
  public canGetCode: boolean = true;
  public codeMessage: string = '获取验证码';
  public agreeProtocol: boolean = true;

  private validateServerName = new Subject<string>(); // 校验用户名，手机号，邮箱是否存在
  private validateServerEntName = new Subject<string>(); // 企业用户名
  private validateServerPhone = new Subject<string>();
  private validateServerEmail = new Subject<string>();

  public signUpForm: FormGroup; // 个人注册
  public entSignUpForm: FormGroup; // 企业注册
  public kaptchaImg: string;

  public account: SignUp = {
    username: null,
    password: null,
    phone: null,
    verifyCode: null,
    kaptcha: null
  };
  public formErrors = {
    username: '',
    password: '',
    phone: '',
    verifyCode: '',
    check: '',
    kaptcha: ''
  };
  public validationMessages = {
    username: {
      required: '请输入用户名',
      maxlength: '用户名至多16个字符',
      invalidateName: '用户名不正确，仅支持中英文、数字和下划线，且不能为纯数字',
      isExist: '用户名已存在'
    },
    password: {
      required: '请输入密码',
      minlength: '密码至少6个字符',
      maxlength: '密码至多16个字符',
      invalidatePassword: '密码格式不正确, 仅支持字母、数字和字符'
    },
    phone: {
      required: '请输入手机号',
      invalidatePhone: '手机号格式不正确',
      isExist: '手机号已存在'
    },
    verifyCode: {
      required: '请输入验证码',
      invalidateCode: '验证码格式不正确'
    },
    check: {
      required: '您需要同意协议才可以注册'
    },
    kaptcha: {
      required: '请输入图片验证码',
      maxlength: '图片验证码至多6位字符'
    }
  };

  public entAccount: EntSignUp = {
    username: '',
    password: '',
    email: '',
    type: null,
    kaptcha: null
  };
  public entFormErrors = {
    username: '',
    password: '',
    email: '',
    type: '',
    check: '',
    kaptcha: ''
  };
  public entValidationMessages = {
    username: {
      required: '请输入用户名',
      maxlength: '用户名至多16个字符',
      invalidateName: '用户名不正确，仅支持中英文、数字和下划线，且不能为纯数字',
      isExist: '用户名已存在'
    },
    password: {
      required: '请输入密码',
      minlength: '密码至少6个字符',
      maxlength: '密码至多16个字符',
      invalidatePassword: '密码格式不正确, 仅支持字母、数字和字符'
    },
    email: {
      required: '请输入邮箱',
      pattern: '请输入有效的邮箱',
      isExist: '邮箱已存在'
    },
    type: {
      required: '请选择用户类型'
    },
    check: {
      required: '您需要同意协议才可以注册'
    },
    kaptcha: {
      required: '请输入图片验证码',
      maxlength: '图片验证码至多6位'
    }
  };
  private EmailReg = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;

  constructor(
    private titleService: Title,
    private signUpService: SignUpService,
    private fb: FormBuilder,
    public snackbar: SnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {
    const title = this.titleService.getTitle();
    this.titleService.setTitle('注册' + title.match(/(\s+-\s+[\u4e00-\u9fa5]+)$/)[0]);

    this.validateServerName
      .debounceTime(1000)
      .distinctUntilChanged()
      .subscribe((key: string) => {
        this.isExistName(key, 'personal');
      });

    this.validateServerEntName
      .debounceTime(1000)
      .distinctUntilChanged()
      .subscribe((key: string) => {
        this.isExistName(key, 'ent');
      });

    this.validateServerPhone
      .debounceTime(1000)
      .distinctUntilChanged()
      .subscribe((key: string) => {
        this.checkPhone(+key);
      });

    this.validateServerEmail
      .debounceTime(1000)
      .distinctUntilChanged()
      .subscribe((key: string) => {
        this.isExistEmail(key);
      });
  }

  public ngOnInit() {
    this.buildForm();
    this.getkaptcha();
  }

  public onChange(key: string, type: string) {
    if (/^\s*$/.test(key)) {
      return;
    }
    switch (type) {
      case 'name':
        this.validateServerName.next(key);
        break;
      case 'entname':
        this.validateServerEntName.next(key);
        break;
      case 'phone':
        this.validateServerPhone.next(key);
        break;
      case 'email':
        this.validateServerEmail.next(key);
        break;
    }
  }

  /**
   * 提交注册表单
   *
   * @memberof SignUpComponent
   */
  public onSubmit(): void {
    this.signUpService.signup(this.account).subscribe((data: any) => {
      if ('2000' === data.code) {
        this.snackbar.success('正在跳转到登录页面', '注册成功');
        this.router.navigate(['/login']);
      }
    });
  }

  /**
   * 提交企业注册表单
   *
   * @memberof SignUpComponent
   */
  public onSubmitEnt(): void {
    this.signUpService.entSignUp(this.entAccount).subscribe((data: any) => {
      if ('2000' === data.code) {
        this.router.navigate(['/signup/verifyemail'], {
          queryParams: {
            email: this.entAccount.email
          }
        });
      }
    });
  }

  /**
   * 获取验证码
   *
   * @returns
   * @memberof SignUpComponent
   */
  public getAuthCode() {
    if (!this.account.phone) {
      this.snackbar.warning('请输入手机号');
      return;
    }
    this.signUpService.getAuthCode(this.account.phone).subscribe((data: any) => {
      if ('2000' === data.code) {
        this.snackbar.success('验证码已发送，请注意查收');
        this.canGetCode = false;
        let seconds = 60;
        const interval = window.setInterval(() => {
          seconds--;
          this.codeMessage = `再次获取（${seconds} s）`;
          if (seconds <= 0) {
            window.clearInterval(interval);
            this.canGetCode = true;
            this.codeMessage = '获取验证码';
          }
        }, 1000);
      }
    });
  }

  // 个人研究员管理员
  private buildForm(): void {
    this.signUpForm = this.fb.group({
      username: [this.account.username, [Validators.required, Validators.maxLength(16), nameValidator()]],
      password: [this.account.password, [Validators.required, Validators.minLength(6), Validators.maxLength(16), passwordValidator()]],
      phone: [this.account.phone, [Validators.required, phoneValidator()]],
      verifyCode: [this.account.verifyCode, [Validators.required, codeValidator()]],
      check: [this.agreeProtocol, [Validators.required]],
      kaptcha: [this.account.kaptcha, [Validators.required, Validators.maxLength(6)]]
    });

    this.signUpForm.valueChanges.subscribe((data: any) => this.onValueChanged(data));

    // ent form build
    this.entSignUpForm = this.fb.group({
      username: [this.entAccount.username, [Validators.required, Validators.maxLength(16), nameValidator]],
      password: [this.entAccount.password, [Validators.required, Validators.minLength(6), Validators.maxLength(16), passwordValidator()]],
      email: [this.entAccount.email, [Validators.required, Validators.pattern(this.EmailReg)]],
      type: [this.entAccount.type, [Validators.required]],
      check: [this.agreeProtocol, [Validators.required]],
      kaptcha: [this.entAccount.kaptcha, [Validators.required, Validators.maxLength(6)]]
    });

    this.entSignUpForm.valueChanges.subscribe((data: any) => this.onEntValueChanged(data));
  }

  private onValueChanged(data?: any) {
    if (!this.signUpForm) {
      return;
    }

    const form = this.signUpForm;

    for (const field of Object.keys(this.formErrors)) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);

      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key of Object.keys(control.errors)) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  private onEntValueChanged(data?: any) {
    if (!this.entSignUpForm) {
      return;
    }

    const form = this.entSignUpForm;

    for (const field of Object.keys(this.entFormErrors)) {
      // clear previous error message (if any)
      this.entFormErrors[field] = '';
      const control = form.get(field);

      if (control && control.dirty && !control.valid) {
        const messages = this.entValidationMessages[field];
        for (const key of Object.keys(control.errors)) {
          this.entFormErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  private getkaptcha() {
    this.signUpService.getKaptcha().subscribe((data: any) => {
      if ('2000' === data.code) {
        this.kaptchaImg = `data:image/jpg;base64,${data.data}`;
      }
    });
  }

  /**
   * 用户名是否存在
   *
   * @private
   * @memberof SignUpComponent
   */
  private isExistName(name: string, type: 'ent' | 'personal') {
    this.signUpService.isExistName(name).subscribe((data: any) => {
      if ('2000' === data.code) {
        if (type === 'personal') {
          const field = 'username';

          // 没有其它错误进行 是否存在 这个错误的显示
          if (!this.formErrors[field]) {
            this.formErrors[field] = '';

            // 已存在，进行显示
            if (data.data === true) {
              this.formErrors[field] += this.validationMessages[field].isExist;
            }
          }
        } else {
          const field = 'username';

          // 没有其它错误进行 是否存在 这个错误的显示
          if (!this.entFormErrors[field]) {
            this.entFormErrors[field] = '';

            // 已存在，进行显示
            if (data.data === true) {
              this.entFormErrors[field] += this.entValidationMessages[field].isExist;
            }
          }
        }
      }
    });
  }

  private isExistEmail(email: string) {
    this.signUpService.isExistEmail(email).subscribe((data: any) => {
      if ('2000' === data.code) {
        const field = 'email';

        // 没有其它错误进行 是否存在 这个错误的显示
        if (!this.entFormErrors[field]) {
          this.entFormErrors[field] = '';

          // 已存在，进行显示
          if (data.data === true) {
            this.entFormErrors[field] += this.entValidationMessages[field].isExist;
          }
        }
      }
    });
  }

  private checkPhone(phone: number) {
    this.signUpService.checkPhone(phone).subscribe((data: any) => {
      if ('2000' === data.code) {
        const field = 'phone';

        // 没有其它错误进行 是否存在 这个错误的显示
        if (!this.formErrors[field]) {
          this.formErrors[field] = '';

          // 已存在，进行显示
          if (data.data === true) {
            this.formErrors[field] += this.validationMessages[field].isExist;
          }
        }
      }
    });
  }
}
