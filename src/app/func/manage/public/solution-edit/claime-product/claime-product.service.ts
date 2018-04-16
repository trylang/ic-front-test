import { Injectable } from '@angular/core';
import { AppService } from '../../../../../app.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ClaimeProductService {
  constructor(private appService: AppService) {}

  /**
   * 获取所有的产品
   *
   * @param {number} [pageNum=1]
   * @param {string} [name=null]
   * @returns {Observable<any>}
   * @memberof ClaimeProductService
   */
  public getAllProducts(pageNum: number = 1, name: string = null): Observable<any> {
    const method = '/search/ic_product';
    return this.appService.POST(method, {page: pageNum, key: name, option: 2});
  }
}
