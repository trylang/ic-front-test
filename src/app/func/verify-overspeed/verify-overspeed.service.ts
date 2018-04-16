import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppService } from '../../app.service';

@Injectable()
export class VerifyOverspeedService {
  constructor(private appService: AppService) {}

  /**
   * 过速请求校验
   *
   * @param {string} kaptcha
   * @returns {Observable<any>}
   * @memberof VerifyOverspeedService
   */
  public verifyOverspeed(kaptcha: string): Observable<any> {
    const method = '/uc/verifyOverspeed';
    return this.appService.GET(method, { kaptcha });
  }

  /**
   * 获取图片验证码
   *
   * @returns {Observable<any>}
   * @memberof VerifyOverspeedService
   */
  public getKaptcha(): Observable<any> {
    const method = '/uc/getKaptcha';
    return this.appService.GET(method);
  }
}
