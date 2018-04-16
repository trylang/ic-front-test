import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppService } from '../../../../app.service';

import { Req, Res } from './model';

@Injectable()
export class AuditService {
  constructor(private appService: AppService) {}

  /**
   * 获取企业列表
   *
   * @param {Req} param
   * @returns {Observable<any>}
   * @memberof AuditService
   */
  public 	listEnterpriseVerify(param: Req): Observable<any> {
    const method = '/admin/listEnterpriseVerify';
    const req = {
      pageNum: param.page,
      companyName: param.key,
      state: param.state,
      sort: param.sort
    };
    return this.appService.POST(method, req);
  }

  /**
   * 获取园区列表
   *
   * @param {Req} param
   * @returns {Observable<any>}
   * @memberof AuditService
   */
  public listParkVerify(param: Req): Observable<any> {
    const method = '/admin/listParkVerify';
    const req = {
      pageNum: param.page,
      parkName: param.key,
      state: param.state,
      sort: param.sort
    };
    return this.appService.POST(method, req);
  }
}
