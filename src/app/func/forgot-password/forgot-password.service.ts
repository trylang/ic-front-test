import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AppService } from '../../app.service';
import { PersionPsdForm, SendEmailForm, EntPsdForm } from './model';

@Injectable()
export class ForgotPsdService {
  constructor(private http: HttpClient, private appService: AppService) {}

  /**
   * 获取图片验证的图片
   *
   * @returns {Observable<any>}
   * @memberof PersonForgotPsdService
   */
  public getKaptcha(): Observable<any> {
    const method = '/uc/getKaptcha';
    return this.appService.GET(method);
    // return this.http.get('http://192.168.1.203/ic-poral/uc/getKaptcha');
  }

  /**
   * 手机修改密码
   * {phone:"123",
   *  authCode:"123456",  authCode是短信中的验证码
   *   password:"password"
   *  kaptcha: 'a2vc'  kaptcha是用户输入的图片验证码
   * }
   * @returns {Observable<any>}
   * @memberof ForgotPsdService
   */
  public messageResetPassword(account: PersionPsdForm): Observable<any> {
    const param = {
      phone: account.phone,
      kaptcha: account.kaptcha,
      password: window.btoa(account.password),
      authCode: account.authCode
    };
    const method = '/account/messageResetPassword';
    return this.appService.POST(method, param, { isFormSubmit: false });
  }

  /**
   * 发送找回密码短信
   * @param phone=123
   * @returns {Observable<any>}
   * @memberof ForgotPsdService
   */
  public getResetPwdAuthCode(phone: any): Observable<any> {
    const method = '/account/getResetPwdAuthCode';
    return this.appService.GET(method, {phone});
  }

  /**
   * 修改密码
   * @param key为邮件链接中的唯一ID
   * @param password=123
   * @param password为base64加密的密码
   * @returns {Observable<any>}
   * @memberof PersonForgotPsdService
   */
  public emailResetPassword(entPsd: EntPsdForm): Observable<any> {
    const param = {
      password: window.btoa(entPsd.password)
    };
    const method =  `/account/emailResetPassword/${entPsd.key}?password=${param.password}`;
    return this.appService.POST(method, []);
  }

  /**
   * 发送忘记密码的邮件
   * @param email=abc@123.com
   * @param kaptcha=ax13
   * @param kaptcha代表用户输入的图片验证码
   * @returns {Observable<any>}
   * @memberof PersonForgotPsdService
   */
  public sendResetPasswordEmail(param: SendEmailForm): Observable<any> {
    const method = '/account/sendResetPasswordEmail';
    return this.appService.POST(method, param);
  }
}
