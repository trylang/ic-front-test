import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppService } from '../../app.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { ParkUser, EntUser } from './model';

@Injectable()
export class AccountService {
  constructor(private http: HttpClient, private appService: AppService) {}

  /**
   * 发送邮件验证
   *
   * @param {string} email
   * @returns {Observable<any>}
   * @memberof VerifyEmailService
   */
  public resendRegisterVerifyEmail(email: string): Observable<any> {
    const url = '/account/resendRegisterVerifyEmail';
    return this.appService.GET(url, { email });
  }

  /**
   * 修改邮箱
   *
   * @param {string} email
   * @returns {Observable<any>}
   * @memberof AccountService
   */
  public changeEmail(email: string): Observable<any> {
    const url = '/user/changeEmail';
    return this.appService.GET(url, { email });
  }

  /**
   * 获取园区企业用户的实体基本信息
   *
   * @returns {Observable<any>}
   * @memberof AccountService
   */
  public getRelatedEntityForCurrentUser(): Observable<any> {
    const method = '/enterpriseUser/getRelatedEntityForCurrentUser';
    return this.appService.GET(method);
  }

  /**
   * 登出
   *
   * @returns {Observable<any>}
   * @memberof HeaderAccountService
   */
  public logout(): Observable<any> {
    const method = 'account/logout';
    return this.appService.GET(method);
  }
}
