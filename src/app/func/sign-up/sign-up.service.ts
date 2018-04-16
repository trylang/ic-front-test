import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AppService } from '../../app.service';
import { SignUp, EntSignUp } from './model';

@Injectable()
export class SignUpService {
  constructor(private appService: AppService) {}

  /**
   * Personal Sign up
   *
   * @param {SignUpForm} account
   * @returns
   * @memberof SignUpService
   */
  public signup(account: SignUp): Observable<any> {
    const method = '/account/personalRegister';
    const param: SignUp = {
      username: account.username,
      password: window.btoa(account.password),
      phone: account.phone,
      verifyCode: account.verifyCode,
      kaptcha: account.kaptcha
    };

    return this.appService.POST(method, param, { isFormSubmit: true });
  }

  /**
   * 获取手机验证码
   *
   * @param {number} phone
   * @returns
   * @memberof SignUpService
   */
  public getAuthCode(phone: number) {
    const url = '/account/getRegisterAuthCode?phone=' + phone;
    return this.appService.GET(url);
  }

  /**
   * 企业园区用户注册
   *
   * @param {SignUpEnt} param
   * @returns {Observable<any>}
   * @memberof SignUpService
   */
  public entSignUp(param: EntSignUp): Observable<any> {
    const method = '/account/entRegister';
    const pData: EntSignUp = {
      username: param.username,
      password: window.btoa(param.password),
      email: param.email,
      type: param.type,
      kaptcha: param.kaptcha
    };
    return this.appService.POST(method, pData);
  }

  /**
   * 判断用户名是否存在
   *
   * @param {string} name
   * @returns {Observable<any>}
   * @memberof SignUpService
   */
  public isExistName(username: string): Observable<any> {
    const method = '/account/isExistName';
    return this.appService.GET(method, { username });
  }

  /**
   * 判断邮箱是否存在
   *
   * @param {string} email
   * @returns {Observable<any>}
   * @memberof SignUpService
   */
  public isExistEmail(email: string): Observable<any> {
    const method = '/account/isExistEmail';
    return this.appService.GET(method, { email });
  }

  /**
   * 校验手机号是否存在
   *
   * @param {number} phone
   * @returns {Observable<any>}
   * @memberof SignUpService
   */
  public checkPhone(phone: number): Observable<any> {
    const method = '/uc/checkPhone';
    return this.appService.GET(method, { phone });
  }

  /**
   * 获取图片验证码
   *
   * @returns {Observable<any>}
   * @memberof SignUpService
   */
  public getKaptcha(): Observable<any> {
    const method = '/uc/getKaptcha';
    return this.appService.GET(method);
  }
}
