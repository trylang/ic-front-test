import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppService } from '../../../../app.service';
import { Observable } from 'rxjs/Observable';
import { QueryParam } from './model';

@Injectable()
export class CaseAdminService {
  constructor(private http: HttpClient, private appService: AppService) {}

  /**
   * 管理员取案例列表
   *
   * @param {QueryParam} queryParam
   * @returns {Observable<any>}
   * @memberof CaseAdminService
   */
  public listCases(queryParam: QueryParam): Observable<any> {
    const method = '/admin/listCases';
    const param = {
      pageNum: queryParam.page,
      name: queryParam.stype === 'owner' ? null : queryParam.key,
      owner: queryParam.stype === 'owner' ? queryParam.key : null,
      accountType: queryParam.type,
      sort: queryParam.sort
    };
    return this.http.get(this.appService.resolveParamUrl(method, param));
  }

  /**
   * 删除案例
   *
   * @param {string} md5
   * @returns {Observable<any>}
   * @memberof CaseAdminService
   */
  public deleteCase(md5: string): Observable<any> {
    const url = `${this.appService.baseURL}/admin/deleteCase?md5=${md5}`;
    return this.http.get(url);
  }
}
