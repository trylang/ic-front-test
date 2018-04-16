import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Jsonp, URLSearchParams  } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

import { AppService } from '../../../app.service';
import { Park } from '../model/park.model';
import { SearchParam } from '../model/search-param.model';

@Injectable()
export class ParkService {

  // 搜索接口定义
  private searchUrl = this.appService.baseURL + '/search/ic_park' ;
  private times: number;
  // 请求头定义
  private headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient, private jsonp: Jsonp, private appService: AppService) { }

  /**
   * 搜索接口
   * @param {Solution} solution
   * @param {number} page
   * @returns {Observable<Solution[]>}
   * @memberof SolutionService
   */
  public getParkList(search: SearchParam): Observable<any> {
    const param = JSON.stringify(search);
    return this.http
    .post(this.searchUrl, param , {headers: this.headers });
  }

  /**
   * 获取园区基本信息
   * @param md5
   */
  public getParkDetail(md5: string): Observable<any> {
    const method = '/park/getBasic';
    return this.appService.GET(method, {md5});
  }

  /**
   * 获取园区介绍
   * @param md5
   */
  public getIntroductionById(md5: string): Observable<any> {
    const method = '/park/getIntroduction';
    return this.appService.GET(method, {md5});
  }

  /**
   * 获取优惠政策
   * @param md5
   */
  public getPreferentialById(md5: string): Observable<any> {
    const method = '/park/getPreferential';
    return this.appService.GET(method, {md5});
  }

  /**
   * 获取入驻企业
   * @param md5
   */
  public getCompaniesById(md5: string, pageNum: number): Observable<any> {
    const method = '/park/getCompanies';
    return this.appService.GET(method, {md5, pageNum});
  }

  /**
   * 获取品牌优势
   * @param md5
   */
  public getBrandAdvsById(md5: string): Observable<any> {
    const method = '/park/getBrandAdvs';
    return this.appService.GET(method, {md5});
  }

  /**
   * 获取地理优势数据
   */
  public getMapData(key: string, point: any, distance: number, page: number): Observable<any> {
    const apiUrl = 'http://api.map.baidu.com/place/v2/search?callback=JSONP_CALLBACK';
    const callback = '&query=' + key + '&tag=交通&location=' + point.lat + ',' + point.lng + '&radius=' + distance + '&output=json&scope=2'
    + '&sort_name=distance&sort_rule=1&page_size=10&page_num=' + page + '&key=37492c0ee6f924cb5e934fa08c6b1676&ak=iGL6v8Ug9gMX9lPbaUYZYaPuAYlK3x8H';
    return this.jsonp.request(apiUrl + callback).map((res) => res.json());
  }

  /**
   * 获取服务优势
   * @param md5
   */
  public getServiceAdvById(md5: string): Observable<any> {
    const method = '/park/getServiceAdv';
    return this.appService.GET(method, {md5});
  }

  /**
   * 获取园区物业信息
   * @param md5
   */
  public getPropertiesById(md5: string): Observable<any> {
    const method = '/park/getProperties';
    return this.appService.GET(method, {md5});
  }

  /**
   * 获取园区的主导产业和基础设施
   *
   * @returns {Observable<any>}
   * @memberof ParkService
   */
  public getIndustryAndPlant(): Observable<any> {
    const url = '/asset/localdb/park.json';
    return this.appService.GetJSON(url);
  }

}
