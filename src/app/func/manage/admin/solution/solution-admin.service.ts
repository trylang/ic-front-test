import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { AppService } from '../../../../app.service';

import { QueryParam } from './model';

@Injectable()
export class SolutionAdminService {
  constructor(private appService: AppService, private http: HttpClient) {}

  /**
   * 管理员获取方案
   *
   * @param {QueryParam} queryParam
   * @returns {Observable<any>}
   * @memberof SolutionAdminService
   */
  public listSolutions(queryParam: QueryParam): Observable<any> {
    const method = '/admin/listSolutions';
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
   * 删除方案
   *
   * @param {string} md5
   * @returns {Observable<any>}
   * @memberof SolutionAdminService
   */
  public deleteSolution(md5: string): Observable<any> {
    const url = `${this.appService.baseURL}/admin/deleteSolution?md5=${md5}`;
    return this.http.get(url);
  }
}
