import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppService } from '../../../../../app.service';

import { Basic } from './basic.model';

@Injectable()
export class BasicService {
  constructor(
    private appService: AppService
  ) {}


  /**
   * 新增园区基本信息
   *
   * @param {Basic} param
   * @returns {Observable<any>}
   * @memberof BasicService
   */
  public addParkBasic(param: Basic): Observable<any> {
    const method = '/researcher/addParkBasic';
    return this.appService.POST(method, param);
  }

  /**
   * 修改园区基本信息
   *
   * @param {Basic} param
   * @returns {Observable<any>}
   * @memberof BasicService
   */
  public changeParkBasic(param: Basic): Observable<any> {
    const method = '/researcher/changeParkBasic';
    return this.appService.POST(method, param);
  }

  /**
   * 获取园区基本信息
   *
   * @param {string} md5
   * @returns {Observable<any>}
   * @memberof BasicService
   */
  public getBasic(md5: string): Observable<any> {
    const method = '/park/getBasic';
    return this.appService.GET(method, { md5 });
  }

  /**
   * 获取园区的主导产业和基础设施
   *
   * @returns {Observable<any>}
   * @memberof BasicService
   */
  public getIndustryAndPlant(): Observable<any> {
    const url = '/asset/localdb/park.json';
    return this.appService.GetJSON(url);
  }
}
