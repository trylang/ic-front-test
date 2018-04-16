import { Injectable } from '@angular/core';
import { AppService } from '../../../../app.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ClaimeEntService {
  constructor( private appService: AppService) {}

  /**
   * 获取企业列表
   *
   * @param {number} pageNum
   * @param {string} [name]
   * @returns {Observable<any>}
   * @memberof ClaimeEntService
   */
  public listCompanies(pageNum: number, name?: string): Observable<any> {
    const method: string = '/researcher/getAllCompanies';
    const param: object = {
      pageNum,
      name
    };

    return this.appService.GET(method, param);
  }
}
