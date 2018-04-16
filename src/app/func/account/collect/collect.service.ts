import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppService } from '../../../app.service';
import { Observable } from 'rxjs/Observable';

// import { EntUser } from './model/ent-user.model';

@Injectable()
export class CollectService {
    constructor(private http: HttpClient, private appService: AppService) {}

  /**
   * 分页获取用户收藏的对象
   * @param {number} type=1 专利, type=2 标准, type=3 园区, 4: 方案， 5：产品， 6：政策， 7：企业
   * @param {number} pageNum
   * @returns {Observable<any>}
   * @memberof AccountService
   */
  public getCollection(type: number, page: number): Observable<any> {
    const url = `/enterpriseUser/getCollection?type=${type}&pageNum=${page}`;
    return this.appService.GET(url);
  }

  // 分页获取收藏供应商
  public getSupplierCollections(page: number): Observable<any> {
    const url = `/enterpriseUser/getSupplierCollections?pageNum=${page}`;
    return this.appService.GET(url);
  }

   /**
    * 取消收藏
    * @param {number} id
    * @returns {Observable<any>}
    * @memberof AccountService
    */
  public cancelCollection(md5: string, type: number): Observable<any> {
    const url = `/enterpriseUser/cancelCollection`;
    return this.appService.GET(url, {md5, type});
  }

  /**
   * 通过方案MD5获取行业
   * @param {number} id
   * @returns {Observable<any>}
   * @memberof AccountService
   */
  public getSolutionIndustry(md5: string): Observable<any> {
    const url = `/uc/getSolutionIndustry`;
    return this.appService.GET(url, {md5});
  }

}

