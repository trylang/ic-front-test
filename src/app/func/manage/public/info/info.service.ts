import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppService } from '../../../../app.service';

@Injectable()
export class InfoService {
  constructor(private appService: AppService) {}

  /**
   * 修改密码
   *
   * @param {string} oldPass
   * @param {string} newPass
   * @returns {Observable<any>}
   * @memberof InfoService
   */
  public changePWD(oldPass: string, newPass: string): Observable<any> {
    const url = '/user/changePassword';
    const param = {
      oldPassword: window.btoa(oldPass),
      newPassword: window.btoa(newPass)
    };
    return this.appService.GET(url, param);
  }
}
