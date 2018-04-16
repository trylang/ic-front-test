import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppService } from '../../../../../app.service';

@Injectable()
export class EntTypeService {
  constructor(private appService: AppService) {}

  /**
   * 获取产品供应商
   *
   * @returns {Observable<any>}
   * @memberof EntTypeService
   */
  public getProductSupplierCategory(): Observable<any> {
    return this.appService.GetJSON('/asset/localdb/product.json');
  }

  /**
   * 获取方案供应商
   *
   * @returns {Observable<any>}
   * @memberof EntTypeService
   */
  public getSolutionSupplierCategory(): Observable<any> {
    return this.appService.GetJSON('/asset/localdb/solution.json');
  }
}
