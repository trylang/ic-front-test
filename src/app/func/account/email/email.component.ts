import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn} from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { AccountService } from '../account.service';
import { SnackBar } from '../../../tool/snackbar';
import { Account } from '../../../account.model';
import { emailValidator } from '../../../tool/validator/email-validator.directive';
import * as _ from 'lodash';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss']
})
export class EmailComponent implements OnInit, OnDestroy {

  public isSend: boolean = false;
  public email: string;
  public countdown: number = 5;
  public account: Account;
  public emailForm: FormGroup;
  public formErrors = {
    email: '',
    formError: ''
  };
  public validationMessages = {
    email: {
      required: '请输入邮箱',
      arkValidateEmail: '请输入有效的邮箱'
    }
  };
  private countdownListener: any;
  constructor(private router: Router,
              private fb: FormBuilder,
              private activeRoute: ActivatedRoute,
              private accountService: AccountService,
              private snackBar: SnackBar) {}

  public ngOnInit() {
    this.account = localStorage.getItem('account') ? JSON.parse(localStorage.getItem('account')) : new Account();
    this.email = this.activeRoute.snapshot.queryParams['email'];
    this.buildEmailForm();
  }

  public ngOnDestroy() {
    clearInterval(this.countdownListener);
  }

  public onSubmit(): void {
    this.accountService.changeEmail(this.email).subscribe((data: any) => {
      if ('2000' === data.code) {
        this.isSend = true;
        this.countdownListener = setInterval(() => {
          if (this.countdown > 0) {
            this.countdown--;
          } else {
            clearInterval(this.countdownListener);
            this.logout();
          }
        }, 1000);
      }
    });
  }

  private buildEmailForm(): void {
    this.emailForm = this.fb.group({
      email: [
        this.email,
        [
          Validators.required,
          emailValidator()
        ]
      ]
    });
    this.emailForm.valueChanges.subscribe((data) => this.onValueChanged(data));
  }

    private onValueChanged(data?: any) {
    if (!this.emailForm) {
      return;
    }
    const form = this.emailForm;
    for (const field of Object.keys(this.formErrors)) {
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

  /**
   * 邮箱发送后要重新登陆获取验证信息
   */
  public logout() {
    this.accountService.logout().subscribe((data: any) => {
      if ('2000' === data.code) {
        localStorage.removeItem('account');
        this.account = new Account();
        this.router.navigate(['/login']);
      }
    });
  }
}

