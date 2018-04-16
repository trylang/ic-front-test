import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AppService } from '../../../../app.service';
import { Case } from './case-edit.model';

@Injectable()
export class CaseService {

  constructor(private appService: AppService) {}

  /**
   * 添加案例
   *
   * @param {string} entId
   * @param {Case} param
   * @returns {Observable<any>}
   * @memberof CaseService
   */
  public addCase(param: Case): Observable<any> {
    const method = '/case/add';
    return this.appService.POST(method, param, {isFormSubmit: true});
  }

  /**
   * 修改案例
   *
   * @param {Case} param
   * @returns {Observable<any>}
   * @memberof CaseService
   */
  public updateCase(param: Case): Observable<any> {
    const method = '/case/update';
    return this.appService.POST(method, param, {isFormSubmit: true});
  }

  /**
   * 获取案例详情信息
   *
   * @param {string} md5
   * @returns {Observable<any>}
   * @memberof CaseService
   */
  public getCase(md5: string): Observable<any> {
    const method = '/uc/getCase';
    return this.appService.GET(method, {md5});
  }

  /**
   * 根据企业md5获取方案列表
   *
   * @param {string} md5
   * @returns {Observable<any>}
   * @memberof CaseService
   */
  public getSolutionsByCompanyMd5(md5: string): Observable<any> {
    const method = '/user/getSolutionsByCompanyMd5';
    return this.appService.GET(method, {md5});
  }
}
