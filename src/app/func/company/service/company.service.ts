import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

import { AppService } from '../../../app.service';
import { Company } from '../model/company.model';
import { SearchParam } from '../model/search-param.model';

@Injectable()
export class CompanyService {

  // 搜索接口定义
  private searchUrl = this.appService.baseURL + '/search/ic_company' ;

  // 请求头定义
  private headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient, private appService: AppService) { }

  /**
   * 获取行业列表
   * @returns {Observable<any>}
   * @memberof SolutionService
   */
  public getCategory(): Observable<any> {
    return this.appService.GET('/uc/getSolutionIndustries');
  }

  /**
   * 搜索接口
   * @param {Solution} solution
   * @param {number} page
   * @returns {Observable<Solution[]>}
   * @memberof SolutionService
   */
  public getCompanyList(search: SearchParam, page: number): Observable<any> {
    search.page = page;
    const param = JSON.stringify(search);
    return this.http
    .post(this.searchUrl, param , {headers: this.headers });
  }


  /**
   * 获取供应商详情
   * @param md5
   */
  public getCompanyDetail(md5: string): Observable<any> {
    const method = '/uc/getSupplier ';
    return this.appService.GET(method, {md5});
  }

  /**
   * 获取供应商相关方案
   * @param {string} md5
   * @returns {Observable<any>}
   * @memberof CompanyService
   */
  public getSolutionByCompanyId(md5: string, pageNum: number): Observable<any> {
    const method = '/uc/getSoultionOfSupplier';
    return this.appService.GET(method, {md5, pageNum});
  }


  /**
   * 获取供应商相关产品
   * @param {string} md5
   * @param {number} pageNum
   * @returns {Observable<any>}
   * @memberof CompanyService
   */
  public getProductByCompanyId(md5: string, pageNum: number): Observable<any> {
    const method = '/uc/getProductOfSupplier';
    return this.appService.GET(method, {md5, pageNum});
  }


  /**
   * 获取相关专利信息
   * @param md5:c60456056f9ecbe0bb4d99493abad31e
   * @param pageNum
   */
  public getPatentByCompanyId(md5: string, pageNum: number) {
    const method = '/uc/getZhuanliByCompany';
    return this.appService.GET(method, {md5, pageNum});
  }

  /**
   * 获取城市
   */
  public getProvinces(): Observable<any> {
    return this.appService.GetJSON('/asset/localdb/ent.json');
  }

  /**
   * 获取搜索列表的产品供应商及方案供应商
   *
   * @returns {Observable<any>}
   * @memberof EntEditService
   */
  public getSearchAccess(): Observable<any> {
    return this.appService.GetJSON('/asset/localdb/company.json');
  }

}
