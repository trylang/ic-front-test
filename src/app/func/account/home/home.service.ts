import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { AppService } from '../../../app.service';

@Injectable()
export class HomeService {

  constructor(private http: HttpClient, private appService: AppService) {}

  /**************************************以下是企业用户导航栏数据接口******************************************* */

  /**
   * 获取当前收藏信息
   * @returns {Observable<any>}
   */
  public getCollect(): Observable<any> {
    return this.appService.GetJSON('/asset/localdb/collect-solution.json');
  }

  /**
   * 根据用户关注的方案行业分页获取最新方案
   * @param {number} page
   */
  public getLatestSolution(page: number): Observable<any> {
    const url = `/enterpriseUser/getLatestSolution?pageNum=${page}`;
    return this.appService.GET(url);
  }

  /**
   * 分页获取最新政策（用户无关）
   * @param {number} page
   * @memberof AccountService
   */
  public getLatestPolicy(page: number): Observable<any> {
    const url = `/enterpriseUser/getLatestPolicy?pageNum=${page}`;
    return this.appService.GET(url);
  }

  /**
   * 获取园区订阅
   * @param page
   */
  public getParkSub(page: number): Observable<any> {
    const url = `/user/getParkSub?pageNum=${page}`;
    return this.appService.GET(url);
  }

  /**
   * 获取企业订阅
   * @returns {Observable<any>}
   */
  public getCompanySub(page: number): Observable<any> {
    const url = `/enterpriseUser/getCompanySub?pageNum=${page}`;
    return this.appService.GET(url);
  }

  /**
   * 获取供应商收藏
   * @returns {Observable<any>}
   */
  public getCollection(type: number, page: number): Observable<any> {
    const url = `/enterpriseUser/getCollection?type=${type}&pageNum=${page}`;
    return this.appService.GET(url);
  }

  // 分页获取供应商动态 type=1 代表方案， 2为案例，3为产品
  public getSupplierDynamics(page: number, type?: number): Observable<any> {
    const url = `/enterpriseUser/getSupplierDynamics?pageNum=${page}&type=${type}`;
    return this.appService.GET(url);
  }


  /**************************************以下是企业分析图表数据接口******************************************* */

  /**
   * 获取企业舆情
   * @param {string} md5
   * @param {number} pageNum
   * @returns {Observable<any>}
   * @memberof AccountService
   */
  public getCompanyNewsList(md5: string, pageNum: number): Observable<any> {
    const url = `/enterpriseUser/getCompanyNewsList`;
    return this.appService.POST(url, {md5, pageNum}, {isFormSubmit: true});
  }

  /**
   * 获取持股比例分析
   * @param {string} md5
   * @returns {Observable<any>}
   * @memberof HomeService
   */
  public searchShareHold(md5: string): Observable<any> {
    const method = '/uc/getChigubili';
    return this.appService.GET(method,  {md5});
  }

  /**
   * 获取投资分析
   * @param {string} md5
   * @returns {Observable<any>}
   * @memberof HomeService
   */
  public searchInvRelation(md5: string): Observable<any> {
    const method = '/uc/getInvRelationship';
    return this.appService.GET(method, {md5});
  }

  /**
   * 获取风险分析
   * @param {string} key
   * @param {number} option
   * @returns {Observable<any>}
   * @memberof HomeService
   */
  public searchCourdoc(key: string): Observable<any> {
    const method = '/search/ic_courtdoc';
    return this.appService.POST(method, { key, option: 2});
  }

  /**
   * 获取创新分析
   * @param {string} key
   * @param {number} option
   * @returns {Observable<any>}
   * @memberof HomeService
   */
  public searchPatent(key: string): Observable<any> {
    const method = '/search/ic_patent';
    return this.appService.POST(method, { key, option: 5});
  }

  /**
   * 获取中标分析
   * @param {string} key
   * @param {number} option
   * @returns {Observable<any>}
   * @memberof HomeService
   */
  public searchBid(key: string): Observable<any> {
    const method = '/search/ic_bid';
    return this.appService.POST(method, { key, option: 4});
  }

  /**
   * 获取软著分析
   * @param {string} key
   * @param {number} option
   * @returns {Observable<any>}
   * @memberof HomeService
   */
  public searchSoftRight(key: string): Observable<any> {
    const method = '/search/ic_softright';
    return this.appService.POST(method, { key, option: 2});
  }

  /**************************************************主页编辑业务************************************************************** */
  /**
   * 获取所有的企业
   *
   * @param {number} [pageNum=1]
   * @param {string} [name=null]
   * @returns {Observable<any>}
   * @memberof ClaimeProductService
   */
  public searchCompany(page: number = 1, key: string = null, option: number = 2): Observable<any> {
    const method = '/search/ic_company';
    return this.appService.POST(method, {page, key, option});
  }

  /**
   * 获取所有的园区
   *
   * @param {number} [page=1]
   * @param {string} [key=null]
   * @returns {Observable<any>}
   * @memberof ClaimeProductService
   */
  public searchPark(page: number = 1, key: string = null, option: number = 2): Observable<any> {
    const method = '/search/ic_park';
    return this.appService.POST(method, {page, key, option});
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
   * 获取行业列表
   * @returns {Observable<any>}
   */
  public getIndustrySubscribe(): Observable<any> {
    const url = `/enterpriseUser/getIndustrySubscribe`;
    return this.appService.GET(url);
  }

  /**
   * 获取园区舆情
   * @param {string} md5
   * @param {number} pageNum
   * @returns {Observable<any>}
   * @memberof AccountService
   */
  public getParkNewsList(md5: string, pageNum: number): Observable<any> {
    const url = `/user/getParkNewsList`;
    return this.appService.GET(url, {md5, pageNum});
  }

  // 添加或修改用户关注的方案应用行业
  public modifyIndustrySub(industries: string[]): Observable<any> {
    const url = `/enterpriseUser/modifyIndustrySub`;
    return this.appService.GET(url, {industries});
  }

  // 添加用户订阅企业
  public addCompanySub(md5: string, group: string): Observable<any> {
    const url = `/enterpriseUser/addCompanySub`;
    return this.appService.GET(url, {md5, group});
  }

  // 添加园区的园区订阅
  public addParkSub(md5: string, name: string): Observable<any> {
    const url = `/user/addParkSub`;
    return this.appService.GET(url, {md5, name});
  }

  // 删除一条订阅企业信息
  public deleteCompanySub(id: number): Observable<any> {
    const url = `/enterpriseUser/deleteCompanySub?id=${id}`;
    return this.appService.GET(url);
  }

  // 取消园区的园区订阅
  public cancelParkSub(id: number): Observable<any> {
    const url = `/user/cancelParkSub?id=${id}`;
    return this.appService.GET(url);
  }

  // 修改订阅企业的分组信息
  public modifyCompanySub(id: number, groups: string): Observable<any> {
    const url = `/enterpriseUser/modifyCompanySub`;
    return this.appService.GET(url, {id, groups});
  }

  /**
   * 获取企业详情
   * @param md5
   */
  public getCompanyDetail(md5: string): Observable<any> {
    const method = '/uc/getSupplier ';
    return this.appService.GET(method, {md5});
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

  /**
   * 通过当前用户获取MD5
   * @param {number} id
   * @returns {Observable<any>}
   * @memberof AccountService
   */
  public getRelatedEntityForCurrentUser(): Observable<any> {
    const url = `/enterpriseUser/getRelatedEntityForCurrentUser`;
    return this.appService.GET(url);
  }
}
