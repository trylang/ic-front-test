import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppService } from '../../../app.service';

@Injectable()
export class PasswordService {
  constructor(private appService: AppService) {}

  /**
   * 修改密码
   *
   * @param {string} oldPass
   * @param {string} newPass
   * @returns {Observable<any>}
   * @memberof AccountService
   */
  public changePWD(oldPass: string, newPass: string): Observable<any> {
    const url = '/user/changePassword';
    const param = {
      oldPassword: window.btoa(oldPass),
      newPassword: window.btoa(newPass)
    };
    return this.appService.POST(url, param, {isFormSubmit: true});
  }

  /**
   * 登出
   */
  public logout(): Observable<any> {
    const method = 'account/logout';
    return this.appService.GET(method);
  }
}
