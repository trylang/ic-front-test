import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppService } from '../../../../app.service';
import { Observable } from 'rxjs/Observable';
import { QueryParam } from './model';

@Injectable()
export class ProductAdminService {
  constructor(private http: HttpClient, private appService: AppService) {}

  /**
   * 管理员获取产品列表
   *
   * @param {QueryParam} queryParam
   * @returns {Observable<any>}
   * @memberof ProductAdminService
   */
  public listProducts(queryParam: QueryParam): Observable<any> {
    const method = '/admin/listProducts';
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
   * 删除产品
   *
   * @param {string} md5
   * @returns {Observable<any>}
   * @memberof ProductAdminService
   */
  public deleteProduct(md5: string): Observable<any> {
    const url = `${this.appService.baseURL}/admin/deleteProduct?md5=${md5}`;
    return this.http.get(url);
  }
}
