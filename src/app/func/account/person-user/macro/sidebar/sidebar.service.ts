import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppService } from '../../../../../app.service';

@Injectable()
export class SidebarService {
  constructor(private appService: AppService) {}

  /**
   * 获取顶级分类
   *
   * @returns {Observable<any>}
   * @memberof SidebarService
   */
  public getBasicInfo(): Observable<any> {
    const method = '/kpi/getBasicInfo';
    return this.appService.GET(method);
  }

  /**
   * 获取子级分类
   *
   * @param {number} parentId
   * @returns {Observable<any>}
   * @memberof SidebarService
   */
  public getCascade(parentId: number): Observable<any> {
    const method = '/kpi/getCascade';
    return this.appService.GET(method, {parentId});
  }

  /**
   * 搜索宏观分类
   *
   * @param {string} keyword
   * @returns {Observable<any>}
   * @memberof SidebarService
   */
  public getByKeyword(keyword: string, pageNum: number): Observable<any> {
    const method = '/kpi/getByKeyword';
    return this.appService.GET(method, {keyword, pageNum});
  }
}
