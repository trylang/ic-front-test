import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';

import { AppService } from '../../../../app.service';
import { Product } from './product-edit.model';

@Injectable()
export class ProductEditService {
  constructor(private http: HttpClient, private appService: AppService) {}

  /**
   * 研究员新增产品
   *
   * @param {Product} param
   * @returns
   * @memberof ProductEditService
   */
  public addProduct(param: Product) {
    const method = '/product/add';
    return this.appService.POST(method, param, { isFormSubmit: true });
  }

  /**
   * 研究员修改产品
   *
   * @param {Product} param
   * @returns {Observable<any>}
   * @memberof ProductEditService
   */
  public updateProduct(param: Product): Observable<any> {
    const method = '/product/update';
    return this.appService.POST(method, param, { isFormSubmit: true });
  }

  /**
   * 获取产品详情
   *
   * @param {string} md5
   * @returns {Observable<any>}
   * @memberof ProductEditService
   */
  public getProductByMD5(md5: string): Observable<any> {
    const method = '/uc/getProductByMD5';
    return this.appService.GET(method, { md5 });
  }

  /**
   * 获取产品分类
   *
   * @returns {Observable<any>}
   * @memberof ProductEditService
   */
  public getProductCats(): Observable<any> {
    const method = '/asset/localdb/product.json';
    return this.appService.GetJSON(method);
  }

  /**
   * 根据产品md5获取关联的方案
   *
   * @param {string} md5
   * @returns {Observable<any>}
   * @memberof ProductEditService
   */
  public getSimpleSolutionOfProduct(md5: string): Observable<any> {
    const method = '/uc/getSimpleSolutionOfProduct';
    return this.appService.GET(method, {md5});
  }
}
