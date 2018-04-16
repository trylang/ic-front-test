import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppService } from '../../../../app.service';

import { QueryParam } from './model';

@Injectable()
export class SolutionService {
  constructor(private appService: AppService  ) {}

  /**
   * 研究员获取方案
   *
   * @param {QueryParam} queryParam
   * @returns {Observable<any>}
   * @memberof SolutionService
   */
  public getSolutionsByOwner(queryParam: QueryParam): Observable<any> {
    const method = '/researcher/getSolutionsByOwner';
    const param = {
      pageNum: queryParam.page,
      status: queryParam.status,
      time: queryParam.time,
      name: queryParam.key
    };
    return this.appService.GET(method, param);
  }

}
