import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AppService } from '../../app.service';
import { LogInForm } from './model';

@Injectable()
export class LogInService {
  constructor(private appService: AppService) {}

  /**
   * Log in
   *
   * @param {LogInForm} account
   * @param {string} type
   * @returns {Observable<any>}
   * @memberof LogInService
   */
  public login(account: LogInForm, type: string): Observable<any> {
    const param = {
      authentication: account.authentication,
      password: window.btoa(account.password),
      remember: account.remember === true ? 1 : 0
    };
    if (type === 'ent') {
      // 企业园区登录
      const method = '/account/parkLogin';
      return this.appService.POST(method, param, { isFormSubmit: true });
    } else {
      // 个人登录
      const method = '/account/login';
      return this.appService.POST(method, param, { isFormSubmit: true });
    }
  }

  /**
   * 获取企业园区所属（已审核通过的信息）
   *
   * @returns {Observable<any>}
   * @memberof LoginService
   */
  public getRelatedEntityForCurrentUser(): Observable<any> {
    const method = '/enterpriseUser/getRelatedEntityForCurrentUser';
    return this.appService.GET(method);
  }
}
