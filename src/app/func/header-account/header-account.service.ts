import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppService } from '../../app.service';

@Injectable()
export class HeaderAccountService {
  constructor(private appService: AppService) {}

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
