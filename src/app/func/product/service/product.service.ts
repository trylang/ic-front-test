import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

import { AppService } from '../../../app.service';
import { Product } from '../model/product.model';
import { SearchParam } from '../model/search-param.model';
import { Morelike } from '../model/morelike-param.model';

@Injectable()
export class ProductService {


  // 搜索接口定义
  private searchUrl = this.appService.baseURL + '/search/ic_product' ;
  private searchLikeUrl = this.appService.baseURL + '/search/ic_product/morelike' ;

  // 请求头定义
  private headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient, private appService: AppService) { }


  /**
   * 获取产品搜索列表
   * @param {SearchParam} search
   * @param {number} page
   * @returns {Observable<Product[]>}
   * @memberof ProductService
   */
  public getProductList(search: SearchParam, page: number): Observable<any> {
    search.page = page;
    const param = JSON.stringify(search);
    return this.http
    .post(this.searchUrl, param , {headers: this.headers });
  }

  /**
   * 获取类似产品类别
   * @param {Morelike} morelike
   * @returns {Observable<Product[]>}
   * @memberof ProductService
   */
  public gettProductLikeList(morelike: Morelike): Observable<any> {
    const param = JSON.stringify(morelike);
    return this.http
    .post(this.searchLikeUrl, param , {headers: this.headers });
  }


  /**
   * 获取产品详情
   * @param {string} md5
   * @returns {Observable<any>}
   * @memberof ProductService
   */
  public getProductDetail(md5: string): Observable<any> {
    const method = '/uc/getProductByMD5';
    return this.appService.GET(method, {md5});
  }


  /**
   * 获取相关方案
   * @param md5
   */
  public getSolutionByProductId(md5: string): Observable<any> {
    const method = '/uc/getSolutionOfProduct';
    return this.appService.GET(method, {md5});
  }

  /**
   * 获城市
   * @returns {Observable<any>}
   * @memberof EntEditService
   */
  public getProvinces(): Observable<any> {
    return this.appService.GetJSON('/asset/localdb/ent.json');
  }

  /**
   * 获取行业分类
   * @returns {Observable<any>}
   * @memberof EntEditService
   */
  public getCategory(): Observable<any> {
    return this.appService.GetJSON('/asset/localdb/product.json');
  }
}
