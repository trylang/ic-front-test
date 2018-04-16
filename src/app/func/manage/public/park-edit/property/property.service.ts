import { Injectable } from '@angular/core';
import { AppService } from '../../../../../app.service';
import { Observable } from 'rxjs/Observable';

import { Property } from './property.model';

@Injectable()
export class PropertyService {
  constructor(private appService: AppService) {}

  /**
   * 获取园区物业信息
   *
   * @param {string} md5
   * @returns {Observable<any>}
   * @memberof PropertyService
   */
  public getProperties(md5: string): Observable<any> {
    const method = '/park/getProperties';
    return this.appService.GET(method, { md5 });
  }

  /**
   * 添加物业
   *
   * @param {string} md5
   * @param {Property} property
   * @returns {Observable<any>}
   * @memberof PropertyService
   */
  public addParkProperty(md5: string, property: Property): Observable<any> {
    const method = '/researcher/addParkProperty';
    return this.appService.POST(method, Object.assign({parkMd5: md5}, property));
  }

  /**
   * 修改园区物业
   *
   * @param {Property} param
   * @returns {Observable<any>}
   * @memberof PropertyService
   */
  public changeParkProperties(parkMd5: string, param: Property): Observable<any> {
    const method = '/researcher/changeParkProperty';
    return this.appService.POST(method, Object.assign({}, param, {parkMd5}));
  }

  /**
   * 删除园区物业
   *
   * @param {string} id
   * @returns {Observable<any>}
   * @memberof PropertyService
   */
  public deleteParkProperty(parkMd5: string, id: string): Observable<any> {
    const method = '/researcher/deleteParkProperty';
    return this.appService.GET(method, { id, parkMd5 });
  }
}
