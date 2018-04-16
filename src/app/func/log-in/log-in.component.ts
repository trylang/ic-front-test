import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from '../../app.service';
import * as _ from 'lodash';

import { SnackBar } from '../../tool/snackbar';

import { LogInService } from './log-in.service';
import { LogInForm, FormError } from './model';
import { Account } from '../../account.model';

@Component({
  selector: 'ark-login',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss'],
  providers: [LogInService]
})
export class LogInComponent implements OnInit {
  public currentTab: string = 'personal'; // 当前显示的Tab

  public logInForm: FormGroup;

  public account: LogInForm = {
    authentication: null,
    password: null,
    remember: null
  };

  public formErrors: FormError = {
    authentication: '',
    password: ''
  };

  public validationMessages = {
    authentication: {
      required: '请输入帐号'
    },
    password: {
      required: '请输入密码'
    },
    remember: {}
  };

  constructor(
    private titleService: Title,
    private logInService: LogInService,
    private fb: FormBuilder,
    private snackbar: SnackBar,
    private router: Router,
    private appService: AppService
  ) {
    const title = this.titleService.getTitle();
    this.titleService.setTitle('登录' + title.match(/(\s+-\s+[\u4e00-\u9fa5]+)$/)[0]);
  }

  public ngOnInit() {
    this.buildForm();

    // TODO: change tab, empty data.
    $('a[data-toggle="pill"]').on('shown.bs.tab', (e: any) => {
      this.currentTab = (e.currentTarget.hash as string).slice(1);

      this.account = new LogInForm();
      this.formErrors = new FormError();
      // console.warn(this.currentTab);
    });
  }

  public onSubmit(type: string): void {
    this.logInService.login(this.account, type).subscribe(async (data: any) => {
      if ('2000' === data.code) {
        const types = ['个人用户', '研究员', '企业用户', '园区用户', '管理员'];
        const storage: Account = await {
          username: data.data.username,
          type: data.data.type,
          typeName: types[data.data.type - 1],
          logo: data.data.logo ? `${data.data.logo}` : (this.appService.isProd ? '' : 'src/') + 'asset/image/common/person.svg',
          phone: data.data.phone,
          email: data.data.email,
          roles: data.data.roles
        };

        // 园区企业用户，格外字段
        if (data.data.type === 3 || data.data.type === 4) {
          // 1. 邮箱是否验证
          storage.hasVerify = (data.data.roles as any[]).some((item: any) => {
            return item.name === 'verify';
          });

          // 2. 是否已经审核通过
          if (storage.hasVerify) {
            await this.validateHasAudit().then(type => {
              storage.hasAudit = type;
            });
          } else {
            storage.hasAudit = false;
          }
        }

        localStorage.setItem('account', JSON.stringify(storage));
        this.snackbar.success('正在跳转到首页', '登录成功');

        _.delay(() => {
          this.router.navigate(['/']);
        }, 500);
      }
    });
  }

  private buildForm(): void {
    this.logInForm = this.fb.group({
      authentication: [this.account.authentication, [Validators.required]],
      password: [this.account.password, [Validators.required]],
      remember: [this.account.remember]
    });

    this.logInForm.valueChanges.subscribe((data: any) => this.onValueChanged(data));
  }

  private onValueChanged(data?: any) {
    if (!this.logInForm) {
      return;
    }

    const form = this.logInForm;

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

  private validateHasAudit(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.logInService.getRelatedEntityForCurrentUser().subscribe((data: any) => {
        if ('2000' === data.code) {
          localStorage.setItem('accountEntity', JSON.stringify(data.data));
          if (data.data) {
            resolve(true);
          } else {
            resolve(false);
          }
        }
      });
    });
  }
}
