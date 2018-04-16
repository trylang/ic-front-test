import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AppService } from '../../../../app.service';
import { QueryParam } from './model';

@Injectable()
export class ParkService {
  constructor(private appService: AppService) {}

  /**
   * 研究员获取园区列表
   *
   * @param {QueryParam} queryParam
   * @returns {Observable<any>}
   * @memberof ParkService
   */
  public getParks(queryParam: QueryParam): Observable<any> {
    const method = '/researcher/listMyAvailableParks';
    const param = {
      pageNum: queryParam.page,
      type: queryParam.status,
      sort: queryParam.sort,
      keyword: queryParam.key
    };
    return this.appService.GET(method, param);
  }
}
