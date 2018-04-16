import { Injectable } from '@angular/core';
import { AppService } from '../../../../../app.service';
import { Observable } from 'rxjs/Observable';
import { Brand } from './brand.model';

@Injectable()
export class AdvantageService {
  constructor(private appService: AppService) {}

  /**
   * 获取园区服务优势
   *
   * @param {string} md5
   * @returns {Observable<any>}
   * @memberof ParkEditService
   */
  public getServiceAdv(md5: string): Observable<any> {
    const method = '/park/getServiceAdv';
    return this.appService.GET(method, { md5 });
  }

  /**
   * 修改园区服务优势
   *
   * @param {string} md5
   * @param {string} serviceAdv
   * @returns {Observable<any>}
   * @memberof ParkEditService
   */
  public changeParkServiceAdv(md5: string, serviceAdv: string): Observable<any> {
    const method = 'researcher/changeParkServiceAdv';
    return this.appService.POST(method, { md5, serviceAdv });
  }

  /**
   * 获取园区品牌优势
   *
   * @param {string} md5
   * @returns {Observable<any>}
   * @memberof ParkEditService
   */
  public getBrandAdvs(md5: string): Observable<any> {
    const method = '/park/getBrandAdvs';
    return this.appService.GET(method, { md5 });
  }

  /**
   * 添加园区品牌优势
   *
   * @param {string} md5
   * @param {string} title
   * @param {string} logo
   * @returns {Observable<any>}
   * @memberof ParkEditService
   */
  public addParkBrandAdv(md5: string, title: string, logo: string): Observable<any> {
    const method = '/researcher/addParkBrandAdv';
    return this.appService.POST(method, { parkMd5: md5, title, logo });
  }

  /**
   * 修改园区品牌优势
   *
   * @param {Brand} brand
   * @returns {Observable<any>}
   * @memberof ParkEditService
   */
  public changeParkBrandAdv(brand: Brand): Observable<any> {
    const method = '/researcher/changeParkBrandAdv';
    return this.appService.POST(method, brand);
  }

  /**
   * 删除园区品牌优势
   *
   * @param {string} id
   * @returns {Observable<any>}
   * @memberof ParkEditService
   */
  public deleteParkBrandAdv(id: string): Observable<any> {
    const method = '/researcher/deleteParkBrandAdv';
    return this.appService.GET(method, { id });
  }
}
