import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { AppService } from '../../../../app.service';

import { QueryParam } from './model';

@Injectable()
export class ParkAdminService {
  constructor(private appService: AppService, private http: HttpClient) {}

  /**
   * 管理员获取园区
   *
   * @param {QueryParam} queryParam
   * @returns {Observable<any>}
   * @memberof ParkAdminService
   */
  public listParks(queryParam: QueryParam): Observable<any> {
    const method = '/admin/listParks';
    const param = {
      pageNum: queryParam.page,
      province: queryParam.province,
      level: queryParam.level,
      // name: queryParam.key,
      // owner: queryParam.owner,
      name: queryParam.stype === 'owner' ? null : queryParam.key,
      owner: queryParam.stype === 'owner' ? queryParam.key : null,
      accountType: queryParam.type,
      sort: queryParam.sort
    };

    return this.appService.GET(method, param);
  }

  /**
   * 删除园区
   *
   * @param {string} md5
   * @returns {Observable<any>}
   * @memberof ParkAdminService
   */
  public deletePark(md5: string): Observable<any> {
    const method = '/admin/deletePark';
    return this.appService.GET(method, { md5 });
  }

  /**
   * 获取省份
   *
   * @returns {Observable<any>}
   * @memberof ParkAdminService
   */
  public getProvinces(): Observable<any> {
    return this.appService.GetJSON('/asset/localdb/ent.json');
  }
}
