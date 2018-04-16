import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppService } from '../../../../../app.service';

import { Req, ParkRes, EntRes } from './model';

@Injectable()
export class AuditDetailService {
  constructor(private appService: AppService) {}

  /**
   * 获取企业用户的审核信息
   *
   * @param {string} username
   * @returns {Observable<any>}
   * @memberof AuditDetailService
   */
  public getEnterpriseVerify(username: string): Observable<any> {
    const method = '/enterpriseUser/getEnterpriseVerify';
    return this.appService.GET(method, { username });
  }

  /**
   * 获取园区用户的用户名
   *
   * @param {string} username
   * @returns {Observable<any>}
   * @memberof AuditDetailService
   */
  public getParkVerify(username: string): Observable<any> {
    const method = '/parkUser/getParkVerify';
    return this.appService.GET(method, { username });
  }

  /**
   * 保存园区审核信息
   *
   * @param {Req} param
   * @returns {Observable<any>}
   * @memberof AuditDetailService
   */
  public saveParkVerityResult(param: Req): Observable<any> {
    const method = '/admin/saveParkVerityResult';
    return this.appService.POST(method, param, { isFormSubmit: true });
  }

  /**
   * 保存企业的审核信息
   *
   * @param {Req} param
   * @returns {Observable<any>}
   * @memberof AuditDetailService
   */
  public saveEnterVerityResult(param: Req): Observable<any> {
    const method = '/admin/saveEnterVerityResult';
    return this.appService.POST(method, param, { isFormSubmit: true });
  }
}
