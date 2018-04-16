import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

import { AppService } from '../../../app.service';
import { SolutionList, SearchParam, Morelike } from '../model';

@Injectable()
export class SolutionService {


  // 搜索接口定义
  private searchUrl = this.appService.baseURL + '/search/ic_solution' ;
  private searchLikeUrl = this.appService.baseURL + '/search/ic_solution/morelike' ;

  // 请求头定义
  private headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient, private appService: AppService) { }

  /**
   * 获取行业列表
   * @returns {Observable<any>}
   * @memberof SolutionService
   */
  public getIndustry(): Observable<any> {
    return this.appService.GET('/uc/getSolutionIndustries');
  }

  /**
   * 获取功能列表
   * @returns {Observable<any>}
   * @memberof SolutionService
   */
  public getFunctions(): Observable<any> {
    return this.appService.GET('/uc/getSolutionFunctions');
  }

  /**
   * 获取方案列表
   * @param {Solution} solution
   * @param {number} page
   * @returns {Observable<Solution[]>}
   * @memberof SolutionService
   */
  public getSolutionList(searchParam: SearchParam): Observable<any> {
    const param = JSON.stringify(searchParam);
    return this.http
    .post(this.searchUrl, param , {headers: this.headers });
  }

  /**
   * 获取类似方案列表
   * @param {Morelike} morelike
   * @returns {Observable<SolutionList[]>}
   * @memberof SolutionService
   */
  public getSolutionLikeList(morelike: Morelike): Observable<any> {
    const param = JSON.stringify(morelike);
    return this.http
    .post(this.searchLikeUrl, param , {headers: this.headers });
  }

  /**
   * 获取方案详情
   *
   * @param {string} md5
   * @returns {Observable<any>}
   * @memberof SolutionEditService
   */
  public getSolution(md5: string): Observable<any> {
    const method = '/uc/getSolution';
    return this.appService.GET(method, {md5});
  }


  /**
   * 获取案例详情信息
   * md5是案例的md5
   * @param {string} md5
   * @returns {Observable<any>}
   * @memberof SolutionEditService
   */
  public getCase(md5: string): Observable<any> {
    const method = '/uc/getCase';
    return this.appService.GET(method, {md5});
  }


  /**
   * 获取案例列表
   * md5是方案的md5
   * @param {string} md5
   * @returns {Observable<any>}
   * @memberof SolutionService
   */
  public getCaseList(md5: string): Observable<any> {
    const method = '/uc/getCasesBySolution';
    return this.appService.GET(method, {solutionMd5: md5});
    // const url = `${this.appService.baseURL}/uc/getCasesBySolution?solutionMd5=${md5}`;
  }

  /**
   * 获取产品列表
   * @param md5
   */
  public getProductList(md5: string): Observable<any> {
    const method = '/uc/getProductsBySolution';
    return this.appService.GET(method, {md5});
  }

  /**
   * 获取本公司相关案例
   * md5是方案md5
   * @param {string} md5
   * @returns {Observable<any>}
   * @memberof SolutionService
   */
  public getCaseRelate(md5: string): Observable<any> {
    const method = '/uc/getOtherCases';
    return this.appService.GET(method, {caseMd5: md5});
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

  /**
   * 获取搜索列表的行业和功能
   *
   * @returns {Observable<any>}
   * @memberof EntEditService
   */
  public getSearchAccess(): Observable<any> {
    return this.appService.GetJSON('/asset/localdb/solution.json');
  }

}
