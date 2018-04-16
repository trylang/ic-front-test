import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppService } from '../../../../../app.service';

import { QueryParam, Res } from './model';

@Injectable()
export class EntService {
  constructor(
    private appService: AppService
  ) {}

  /**
   * 获取企业园区用户列表
   *
   * @returns {Observable<any>}
   * @memberof EntService
   */
  public getCompOrParkAccount(param: QueryParam): Observable<any> {
    const method = '/admin/getCompOrParkAccount';
    const p = {
      page: param.page,
      keyword: param.key,
      sort: param.sort,
      type: param.type
    };
    return this.appService.GET(method, p);
  }

  /**
   * 删除企业，园区用户
   *
   * @param {string} username
   * @returns {Observable<any>}
   * @memberof EntService
   */
  public deleteAccount(username: string): Observable<any> {
    const method = '/admin/deleteAccount';
    return this.appService.GET(method, {username});
  }
}
