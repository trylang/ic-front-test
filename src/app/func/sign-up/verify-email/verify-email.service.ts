import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppService } from '../../../app.service';

@Injectable()
export class VerifyEmailService {
  constructor(private appService: AppService) {}

  /**
   * 重新发送邮件验证
   *
   * @param {string} email
   * @returns {Observable<any>}
   * @memberof VerifyEmailService
   */
  public resendRegisterVerifyEmail(email: string): Observable<any> {
    const method = '/account/resendRegisterVerifyEmail';
    return this.appService.GET(method, {email});
  }
}
