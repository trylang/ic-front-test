import { Injectable } from '@angular/core';
import { AppService } from '../../../../../app.service';
import { Observable } from 'rxjs/Observable';

import { QueryParam } from './model';

@Injectable()
export class PersonService {
  constructor(private appService: AppService) {}

  /**
   * 获取个人用户列表
   *
   * @param {QueryParam} queryParam
   * @returns
   * @memberof PersonService
   */
  public getPersonalAccount(queryParam: QueryParam): Observable<any> {
    const method = '/admin/getPersonalAccount';
    const param = {
      pageNum: queryParam.page,
      keyword: queryParam.key,
      sort: queryParam.sort,
      type: queryParam.type
    };
    return this.appService.GET(method, param);
  }

  /**
   * 删除用户名
   *
   * @param {string} username
   * @returns {Observable<any>}
   * @memberof PersonService
   */
  public deleteAccount(username: string): Observable<any> {
    const method = '/admin/deleteAccount';
    return this.appService.GET(method, {username});
  }

  /**
   * 升级个人用户为研究员
   *
   * @param {string} username
   * @returns {Observable<any>}
   * @memberof PersonService
   */
  public convertToResearcher(username: string): Observable<any> {
    const method = '/admin/convertToResearcher';
    return this.appService.GET(method, {username});
  }
}
