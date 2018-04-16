import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { AppService } from '../../app.service';

@Injectable()
export class HomeService {
  constructor(private http: HttpClient, private appService: AppService) {}

  /**
   * 获取本地首页静态数据
   *
   * @returns {Observable<any>}
   * @memberof HomeService
   */
  public getProductData(): Observable<any> {
    return this.http.get('/asset/localdb/slide-product.json');
  }
}
