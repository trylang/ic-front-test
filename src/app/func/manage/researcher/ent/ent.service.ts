import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { AppService } from '../../../../app.service';
import { QueryParam } from './model';

@Injectable()
export class EntService {
  constructor(private appService: AppService) { }

  /**
   * 根据研究员owner 获取企业列表
   *
   * @param {number} pageNum
   * @param {number} status
   * @param {string} name
   * @param {number} time
   * @returns {Observable<any>}
   * @memberof EntService
   */
  public getCompaniesByOwner(queryParam: QueryParam): Observable<any> {
    const method: string = 'researcher/getCompaniesByOwner';
    const param: object = {
      pageNum: queryParam.page,
      status: queryParam.status,
      name: queryParam.key,
      time: queryParam.time
    };

    return this.appService.GET(method, param);
  }

}
