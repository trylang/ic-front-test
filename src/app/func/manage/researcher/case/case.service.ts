import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppService } from '../../../../app.service';
import { Observable } from 'rxjs/Observable';
import { QueryParam } from './model';

@Injectable()
export class CaseService {
  constructor(private http: HttpClient, private appService: AppService) {}

  /**
   * 研究员获取案例列表
   *
   * @param {QueryParam} queryParam
   * @returns {Observable<any>}
   * @memberof CaseService
   */
  public getCasesByOwner(queryParam: QueryParam): Observable<any> {
    const method = '/researcher/getCasesByOwner';
    const param = {
      pageNum: queryParam.page,
      name: queryParam.key,
      status: queryParam.status,
      time: queryParam.time
    };
    return this.appService.GET(method, param);
  }
}
