import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { AppService } from '../../../../app.service';
import { Ent } from './ent-edit.model';

@Injectable()
export class EntEditService {
  constructor(private http: HttpClient, private appService: AppService) { }

  /**
   * 添加企业信息
   *
   * @param {Ent} param
   * @returns {Observable<any>}
   * @memberof EntEditService
   */
  public addCompany(param: Ent): Observable<any> {
    const method = '/uccompany/add';
    return this.appService.POST(method, param, {isFormSubmit: true});
  }

  /**
   * 修改企业信息
   *
   * @param {Ent} param
   * @returns {Observable<any>}
   * @memberof EntEditService
   */
  public updateCompany(param: Ent): Observable<any> {
    const method = '/uccompany/update';
    return this.appService.POST(method, param, {isFormSubmit: true});
  }

  /**
   * 获取行业
   *
   * @returns {Observable<any>}
   * @memberof EntEditService
   */
  public getIndustries(): Observable<any> {
    const method = '/uc/getSolutionIndustries';
    return this.appService.GET(method);
  }

  /**
   * 获取企业详情信息
   *
   * @param {string} md5
   * @returns {Observable<any>}
   * @memberof EntEditService
   */
  public getCompany(md5: string): Observable<any> {
    const method = 'uc/getCompany';
    return this.appService.GET(method, {md5});
  }

  /**
   * 获取省份
   *
   * @returns {Observable<any>}
   * @memberof EntEditService
   */
  public getProvinces(): Observable<any> {
    return this.appService.GetJSON('/asset/localdb/ent.json');
  }
}
