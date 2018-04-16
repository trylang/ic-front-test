import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';

import { AppService } from '../../../../app.service';
import { Solution } from './solution-edit.model';

@Injectable()
export class SolutionEditService {
  constructor(private http: HttpClient, private appService: AppService) { }

  /**
   * 研究员添加方案
   *
   * @param {Solution} param
   * @returns
   * @memberof SolutionEditService
   */
  public addSolution(param: Solution) {
    const method = '/solution/add';
    return this.appService.POST(method, param);
  }

  /**
   * 研究员修改方案
   *
   * @param {Solution} param
   * @returns {Observable<any>}
   * @memberof SolutionEditService
   */
  public updateSolution(param: Solution): Observable<any> {
    const method = '/solution/update';
    return this.appService.POST(method, param);
  }

  /**
   * 获取行业
   *
   * @returns {Observable<any>}
   * @memberof SolutionEditService
   */
  public getIndustries(): Observable<any> {
    const method = '/uc/getSolutionIndustries';
    return this.appService.GET(method);
  }

  /**
   * 获取功能
   *
   * @returns {Observable<any>}
   * @memberof SolutionEditService
   */
  public getFunctions(): Observable<any> {
    const method = '/uc/getSolutionFunctions';
    return this.appService.GET(method);
  }

  /**
   * 获取产品
   *
   * @returns {Observable<any>}
   * @memberof SolutionEditService
   */
  public getProductCategories(): Observable<any> {
    const method = '/uc/getProductCategoriesOfSolution';
    return this.appService.GET(method);
  }

  /**
   * 获取方案详情信息
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
   * 获取方案上传的产品分类
   *
   * @returns {Observable<any>}
   * @memberof SolutionEditService
   */
  public getProductCats(): Observable<any> {
    const method = '/asset/localdb/solution.json';
    return this.appService.GetJSON(method);
  }
}
