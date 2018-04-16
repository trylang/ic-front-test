import { Injectable } from '@angular/core';
import { AppService } from '../../../../app.service';
import { Observable } from 'rxjs/Observable';
import { QueryParam } from './model';

@Injectable()
export class ProductService {
  constructor(private appService: AppService) {}

  /**
   * 研究员获取产品列表
   *
   * @param {QueryParam} queryParam
   * @returns {Observable<any>}
   * @memberof ProductService
   */
  public getProductsByOwner(queryParam: QueryParam): Observable<any> {
    const method = '/researcher/getProductsByOwner';
    const param = {
      pageNum: queryParam.page,
      name: queryParam.key,
      status: queryParam.status,
      time: queryParam.time
    };
    return this.appService.GET(method, param);
  }
}
