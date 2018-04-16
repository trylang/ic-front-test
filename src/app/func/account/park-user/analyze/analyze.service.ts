import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppService } from '../../../../app.service';
import { ReqEnt } from './req-ent.model';

@Injectable()
export class AnalyzeService {
  constructor(private appService: AppService) {}

  /**
   * 获取园区列表
   *
   * @param {string} key
   * @param {number} page
   * @returns {Observable<any>}
   * @memberof AnalyzeService
   */
  public searchPark(key: string, page: number): Observable<any> {
    const method = '/search/ic_park';
    return this.appService.POST(method, { key, page, option: 2});
  }

  /**
   * 获取圈中企业列表
   *
   * @param {ReqEnt} param
   * @returns {Observable<any>}
   * @memberof AnalyzeService
   */
  public searchParkEnt(param: ReqEnt): Observable<any> {
    const method = '/search/ic_ent';
    return this.appService.POST(method, param);
  }
}
