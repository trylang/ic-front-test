import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { AppService } from '../../../../app.service';
import { QueryParam } from './model';

@Injectable()
export class EntAdminService {
  constructor(private http: HttpClient, private appService: AppService) { }

  /**
   * 管理员获取企业列表
   *
   * @param {QueryParam} queryParam
   * @returns {Observable<any>}
   * @memberof EntAdminService
   */
  public listCompanies(queryParam: QueryParam): Observable<any> {
    const method: string = '/researcher/getAllCompanies';
    const param: object = {
      pageNum: queryParam.page,
      name: queryParam.stype === 'owner' ? null : queryParam.key,
      owner: queryParam.stype === 'owner' ? queryParam.key : null,
      accountType: queryParam.type,
      sort: queryParam.sort
    };
    return this.http.get(this.appService.resolveParamUrl(method, param));
  }

  /**
   * 管理员删除企业
   *
   * @param {string} md5
   * @returns {Observable<any>}
   * @memberof EntAdminService
   */
  public deleteCompany(md5: string): Observable<any> {
    const url = `${this.appService.baseURL}/admin/deleteCompany?md5=${md5}`;
    return this.http.get(url);
  }

}
